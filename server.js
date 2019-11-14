const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const bodyParser = require('body-parser')
const base64url = require('base64url');
const aes256 = require('aes256');
const path = require('path')

const db = new sqlite3.Database('sqlite.db', (err) => {
    if (err) {
        return console.log('Could not open SQLITE database')
    }
    console.log('Connected to SQLITE database')
})
const ZIP_PROPERTY = 'Zip Code',
    NAME_PROPERTY = 'Full Name',
    EMAIL_PROPERTY = 'Email Address',
    PASSWORD_PROPERTY = 'Password',
    PHONE_PROPERTY = 'Phone Number',
    CONFIRM_PASSWORD_PROPERTY = 'Confirm Password'
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS valid_zip_codes (zip_code TEXT PRIMARY KEY);')
    db.run('CREATE TABLE IF NOT EXISTS plan (name TEXT PRIMARY KEY, frequency TEXT, ' +
        'pricing REAL, support_availability TEXT, free_delivery TEXT, no_hidden_tips TEXT, online_reports TEXT, advanced_reports TEXT);')
    db.run('CREATE TABLE IF NOT EXISTS grocery_item (id integer PRIMARY KEY, name TEXT, image TEXT);')
    db.run('CREATE TABLE IF NOT EXISTS grocery_list (id integer PRIMARY KEY, name TEXT, image TEXT);')
    db.run('CREATE TABLE IF NOT EXISTS user (id integer PRIMARY KEY, full_name TEXT, password TEXT,' +
        'email TEXT UNIQUE, phone TEXT, plan_name TEXT, grocery_list_id TEXT, ' +
        'address TEXT, zip_code TEXT,' +
        'FOREIGN KEY(plan_name) REFERENCES plan(name), FOREIGN KEY(grocery_list_id) REFERENCES grocery_list(id),' +
        'FOREIGN KEY(zip_code) REFERENCES valid_zip_codes(zip_code));')
})

const app = express();
app.use(express.static(path.join(__dirname, '/iterative_design/build')))
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
const port = process.env.PORT || 5000;

// console.log that your server is up and running
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
const AES_PRIVATE_KEY = 'A_SECRET_KEY_THAT_SHOULDNT_BE_HERE'
const generateJWT = (email, ) => {
    //This private key should technically be stored on a different server, but this is a school project so...
    const header = {
        alg: 'AES256',
        type: 'JWT'
    }
    //Expiration time for tokens is 24 hour in milliseconds
    const EXPIRATION_TIME = 24 * 60 * 60 * 1000
    const payload = {
        email: email ? email : "",
        expiration: Date.now() + EXPIRATION_TIME
    }
    const headerString = base64url.encode(JSON.stringify(header))
    const payloadString = base64url.encode(JSON.stringify(payload))
    const secret = base64url.encode(aes256.encrypt(AES_PRIVATE_KEY, [headerString, payloadString].join('.')))
    return [headerString, payloadString, secret,].join('.')
}

const validateJWT = (jwt) => {
    if (jwt.split('.').length !== 3) {
        return ''
    }
    const [encryptedHeader, encryptedPayload, encryptedSecret] = jwt.split('.')
    const secret = base64url.decode(encryptedSecret)
    console.log("3")
    if (aes256.decrypt(AES_PRIVATE_KEY, secret) !== [encryptedHeader, encryptedPayload].join('.')) {
        return '';
    }
    console.log("4")
    const decryptedPayload = JSON.parse(base64url.decode(encryptedPayload))
    if (decryptedPayload.expiration < Date.now()) {
        return '';
    }
    console.log("5")
    return decryptedPayload.email
}

app.post('/api/register', (req, res) => {
    const params = req.body
    const errors = {}
    console.log(params)
    if (!params[NAME_PROPERTY].value) {
        errors[NAME_PROPERTY] = "Full Name cannot be empty."
    }
    if (!params[PHONE_PROPERTY].value) {
        errors[PHONE_PROPERTY] = "Phone Number cannot be empty"
    }
    if (!params[EMAIL_PROPERTY].value) {
        errors[EMAIL_PROPERTY] = "Email cannot be empty"
    }

    if (!params[PASSWORD_PROPERTY].value || params[PASSWORD_PROPERTY].value.length < 8) {
        errors[PASSWORD_PROPERTY] = "Password length must be at least 8."
    }
    if (params[PASSWORD_PROPERTY].value !== params[CONFIRM_PASSWORD_PROPERTY].value) {
        errors[CONFIRM_PASSWORD_PROPERTY] = "Passwords do not match."
    }
    console.log(errors)
    db.get("SELECT email FROM user WHERE email=?", [params[EMAIL_PROPERTY]], (err, row) => {
        if (err) {
            errors[EMAIL_PROPERTY] = err.message
        } else if (row) {
            errors[EMAIL_PROPERTY] = "Email is already taken."
        }
        if (Object.keys(errors).length !== 0) {
            return res.status(400).json({ errors: errors })
        }
        const paramFields = ['Full Name', 'Password', 'Email Address', 'Phone Number', 'Address', 'Zip Code']

        const sqlParams = paramFields.map((key) => {
            return params[key].value
        })
        const userColumnNames = ['full_name', 'password', 'email', 'phone',
            'address', 'zip_code']
        const columnSQLString = ['(', userColumnNames.join(","), ")"].join('')
        const variableSQLString = ['(', Array.from({ length: userColumnNames.length }).map(x => '?').join(','), ')'].join('')
        db.run('INSERT INTO user ' + columnSQLString + ' VALUES ' + variableSQLString, sqlParams, (err) => {
            if (err) {
                errors[EMAIL_PROPERTY] = "Email is already taken."
                return res.status(400).json({ errors: errors })
            } else {
                const authToken = generateJWT(params[EMAIL_PROPERTY].value)
                return res.status(200).json({ authToken: authToken });
            }
        })
    })


});

app.post('/api/login', (req, res) => {
    const params = req.body
    const paramFields = ['Email Address', 'Password']
    const sqlParams = paramFields.map((key) => {
        return params[key]
    })
    db.get('SELECT id FROM user WHERE email=? AND password=?', sqlParams, (err, row) => {
        if (err || !row) {
            return res.status(400).json({ error: "Invalid email and password combination." })
        } else {
            const authToken = generateJWT(params[EMAIL_PROPERTY])
            return res.status(200).json({ authToken: authToken });
        }
    })
});

const validateZipcode = async (zipcode, res) => {
    db.get("SELECT zip_code FROM valid_zip_codes WHERE zip_code=?", [zipcode], (err, row) => {
        if (err) {
            return res.status(400).json({ errors: { [ZIP_PROPERTY]: err.message } })
        }
        const zipcodeRegex = RegExp(/^\d{5}$|^\d{5}-\d{4}$/)
        if (!row) {
            let errorMessage = zipcodeRegex.test(zipcode) ?
                "Unfortunately, we currently don't serve your area." :
                "Invalid Zip Code Given"
            return res.status(400).json({ errors: { [ZIP_PROPERTY]: errorMessage } })
        }
        return res.status(200).json({})
    })
}

app.get('/api/validate-zipcode', async (req, res) => {
    const zipcode = req.query[ZIP_PROPERTY]
    return await validateZipcode(zipcode, res)
})

app.get('/api/pricing-plans', (req, res) => {
    db.all('SELECT name, frequency, pricing, support_availability, free_delivery, no_hidden_tips, online_reports, advanced_reports FROM plan;', (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message })
        }
        return res.status(200).json({ plans: rows })
    })
})

app.post('/api/set-plan', (req, res) => {
    const planName = req.body.planName
    const userEmail = req.body.userEmail
    console.log(req.body)
    if (!planName || !userEmail) {
        return res.status(400).json({ error: "Invalid request given" })
    }
    db.run('UPDATE user SET plan_name=? WHERE user.email=?', [planName, userEmail], (err2) => {
        if (err2) {
            return res.status(400).json({ error: "Invalid request given" })
        } else {
            return res.status(200).json({});
        }
    })

})

app.get('/api/validate-token', (req, res) => {
    const authToken = req.query['authToken']
    const email = validateJWT(authToken)
    console.log(email, authToken)
    if (!email) {
        return res.status(400).json({})
    }
    db.get('SELECT plan_name FROM user WHERE user.email=?', [email], (err, row) => {
        if (err || !row) {
            return res.status(400).json({})
        }
        return res.status(200).json({ email: email, chosenPlan: row['plan_name'] ? row['plan_name'] : '' })
    })
})

app.get('*', (req, res) => {
    return res.status(200).json({ 'test': path.join(__dirname + '/iterative_design/public/index.html') })
    res.sendFile(path.join(__dirname + '/iterative_design/public/index.html'))
})