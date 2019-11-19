const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const bodyParser = require('body-parser')
const base64url = require('base64url');
const aes256 = require('aes256');
const path = require('path')
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
    CONFIRM_PASSWORD_PROPERTY = 'Confirm Password',
    ADDRESS_PROPERTY = 'Home Address',
    OLD_PASSWORD_PROPERTY = "Old Password",
    NEW_PASSWORD_PROPERTY = "New Password",
    CONFIRM_NEW_PASSWORD_PROPERTY = "Confirm New Password"

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS valid_zip_codes (zip_code TEXT PRIMARY KEY);')
    db.run('CREATE TABLE IF NOT EXISTS plan (name TEXT PRIMARY KEY, frequency TEXT, ' +
        'pricing REAL, support_availability TEXT, free_delivery TEXT, no_hidden_tips TEXT,' +
        'online_reports TEXT, advanced_reports TEXT);')
    db.run('CREATE TABLE IF NOT EXISTS grocery_category (id INTEGER PRIMARY KEY, parent INTEGER, name TEXT UNIQUE);')
    db.run('CREATE TABLE IF NOT EXISTS grocery_sources (name TEXT PRIMARY KEY);')
    db.run('CREATE TABLE IF NOT EXISTS grocery_item (id integer PRIMARY KEY, name TEXT, quantity REAL, quantity_units TEXT, image TEXT,' +
        'price REAL, category TEXT, source TEXT, weight TEXT, ' +
        'UNIQUE(name, quantity, quantity_units),' +
        'FOREIGN KEY(source) REFERENCES grocery_sources(name), FOREIGN KEY(category) REFERENCES grocery_category(name));')
    db.run('CREATE TABLE IF NOT EXISTS user (id integer PRIMARY KEY, full_name TEXT, password TEXT,' +
        'email TEXT UNIQUE, phone TEXT, plan_name TEXT, grocery_cart TEXT, ' +
        'address TEXT, zip_code TEXT,' +
        'FOREIGN KEY(plan_name) REFERENCES plan(name),' +
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
    if (aes256.decrypt(AES_PRIVATE_KEY, secret) !== [encryptedHeader, encryptedPayload].join('.')) {
        return '';
    }
    const decryptedPayload = JSON.parse(base64url.decode(encryptedPayload))
    if (decryptedPayload.expiration < Date.now()) {
        return '';
    }
    return decryptedPayload.email
}
const validateAddressInformation = (params, errors) => {
    const zipcodeRegex = RegExp(/^\d{5}$|^\d{5}-\d{4}$/)
    if (!zipcodeRegex.test(params[ZIP_PROPERTY])) {
        errors[ZIP_PROPERTY] = "Invalid Zip Code Given"
    }
    return errors
}

const validatePersonalInformation = (params, errors) => {
    if (!params[NAME_PROPERTY].value) {
        errors[NAME_PROPERTY] = "Full Name cannot be empty."
    }
    if (!params[PHONE_PROPERTY].value) {
        errors[PHONE_PROPERTY] = "Phone Number cannot be empty"
    }
    if (!params[EMAIL_PROPERTY].value) {
        errors[EMAIL_PROPERTY] = "Email cannot be empty"
    }
    return errors
}
app.post('/api/change-personal-information', (req, res) => {
    const params = req.body
    const userEmail = params.userEmail
    let errors = {}
    errors = validatePersonalInformation(params, errors)
    if (Object.keys(errors).length !== 0) {
        return res.status(400).json({ errors: errors })
    }
    const sqlParams = [params[NAME_PROPERTY].value, params[PHONE_PROPERTY].value, params[EMAIL_PROPERTY].value, userEmail]
    db.run("UPDATE user SET full_name=?, phone=?, email=? WHERE user.email=?", sqlParams, (err) => {
        if (err) {
            errors[EMAIL_PROPERTY] = err.message
            return res.status(400).json({ errors: errors })
        }
        if (userEmail != params[EMAIL_PROPERTY]) {
            const newAuthToken = generateJWT(params[EMAIL_PROPERTY].value)
            return res.status(200).json({ authToken: newAuthToken });
        }
        return res.status(200).json({});
    })
})

app.post('/api/change-address-information', (req, res) => {
    const params = req.body
    const userEmail = params.userEmail
    const zipcode = params[ZIP_PROPERTY].value

    let errors = {}
    errors = validateAddressInformation(param, errors)
    if (Object.keys(errors).length) {
        return res.status(200).json({ error: errors })
    }
    const sqlParams = [zipcode, params[ADDRESS_PROPERTY].value, userEmail]
    db.run("UPDATE user SET zip_code=?, address=? where user.email=?", sqlParams, (err) => {
        return res.status(200).json({});
    })
})
app.post('/api/change-password', (req, res) => {
    const params = req.body
    const errors = {}
    const userEmail = params.userEmail
    if (!params[NEW_PASSWORD_PROPERTY].value || params[NEW_PASSWORD_PROPERTY].value.length < 8) {
        errors[NEW_PASSWORD_PROPERTY] = "New Password length must be at least 8."
    }
    if (params[NEW_PASSWORD_PROPERTY].value !== params[CONFIRM_NEW_PASSWORD_PROPERTY].value) {
        errors[CONFIRM_NEW_PASSWORD_PROPERTY] = "Passwords do not match."
    }
    db.get('SELECT password FROM user WHERE email=?', [userEmail], (err, row) => {
        if (err || !row) {
            return res.status(400).json({ error: "Invalid email and password combination." })
        } else {
            bcrypt.compare(params[OLD_PASSWORD_PROPERTY].value, row.password, (err, doesMatch) => {
                if (!doesMatch) {
                    return res.status(400).json({ error: "Invalid email and password combination." })
                }
                bcrypt.hash(params[NEW_PASSWORD_PROPERTY].value, saltRounds, (err, hash) => {
                    db.run('UPDATE user SET password=? WHERE user.email=?', [hash, userEmail], (err) => {
                        console.log(err)
                        return res.status(200).json({});
                    })
                });
            })
        }
    })
})
app.post('/api/register', (req, res) => {
    const params = req.body
    let errors = {}
    errors = validatePersonalInformation(params, errors)

    if (!params[PASSWORD_PROPERTY].value || params[PASSWORD_PROPERTY].value.length < 8) {
        errors[PASSWORD_PROPERTY] = "Password length must be at least 8."
    }
    if (params[PASSWORD_PROPERTY].value !== params[CONFIRM_PASSWORD_PROPERTY].value) {
        errors[CONFIRM_PASSWORD_PROPERTY] = "Passwords do not match."
    }

    db.get("SELECT email FROM user WHERE email=?", [params[EMAIL_PROPERTY]], (err, row) => {
        if (err) {
            errors[EMAIL_PROPERTY] = err.message
        } else if (row) {
            errors[EMAIL_PROPERTY] = "Email is already taken."
        }
        if (Object.keys(errors).length) {
            return res.status(400).json({ errors: errors })
        }
        const paramFields = [NAME_PROPERTY, PASSWORD_PROPERTY, EMAIL_PROPERTY, PHONE_PROPERTY, ADDRESS_PROPERTY, ZIP_PROPERTY]
        bcrypt.hash(params[PASSWORD_PROPERTY].value, saltRounds, (_, hash) => {
            params[PASSWORD_PROPERTY].value = hash
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
        });

    })
});

app.post('/api/login', (req, res) => {
    const params = req.body
    db.get('SELECT password FROM user WHERE email=?', [params[EMAIL_PROPERTY]], (err, row) => {
        if (err || !row) {
            return res.status(400).json({ error: "Invalid email and password combination." })
        } else {
            bcrypt.compare(params[PASSWORD_PROPERTY], row.password, (err, doesMatch) => {
                if (!doesMatch) {
                    return res.status(400).json({ error: "Invalid email and password combination." })
                }
                const authToken = generateJWT(params[EMAIL_PROPERTY])
                return res.status(200).json({ authToken: authToken });
            })
        }
    })
});


app.get('/api/validate-zipcode', async (req, res) => {
    const errors = validateAddressInformation(req.query, {})
    if (Object.keys(errors).length) {
        return res.status(400).json({ errors: errors })
    }
    return res.status(200).json({})
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


app.get('/api/all-grocery-items', (req, res) => {
    db.all('SELECT name, quantity, quantity_units, image, price, category, source FROM grocery_item;', (_, rows) => {
        return res.status(200).json({ groceryItems: rows })
    })
})

const getItems = (categories, callback, limit = 4, offset = 0) => {
    const sql = "WITH root AS (SELECT id FROM grocery_category WHERE name=?)," +
        'all_children AS (SELECT child FROM grocery_category_closure JOIN root ' +
        'ON grocery_category_closure.parent=root.id), ' +
        'all_categories AS (SELECT name FROM all_children JOIN grocery_category ON grocery_category.id=all_children.child)' +
        'SELECT item.name, quantity, quantity_units, image, price, item.category, source FROM grocery_item as item JOIN all_categories ' +
        'ON item.category=all_categories.name limit ? offset ?;'
    const categoryItemsMap = {}
    db.serialize(() => {
        categories.forEach((category, idx) => {
            db.all(sql, [category, limit, offset], (err, rows) => {
                categoryItemsMap[category] = rows
                if (idx === categories.length - 1) {
                    callback(categoryItemsMap)
                }
            })
        })
    })
}

const getSubCategories = (categoryName = 'All Items', callback) => {
    const sql = 'WITH root AS (SELECT id FROM grocery_category WHERE name=?), ' +
        'subFilters AS (SELECT closure.child from root join grocery_category_closure as closure ON closure.parent = root.id WHERE depth=1) ' +
        'SELECT name FROM subFilters JOIN grocery_category ON subFilters.child = grocery_category.id'
    db.all(sql, [categoryName], (error, rows) => {
        callback({ error: error, rows: rows })
    })
}

app.get('/api/grocery-items', (req, res) => {
    const rootCategory = req.query.rootCategory
    getSubCategories(rootCategory, (data) => {
        if (data.error) {
            return data.error
        }
        let categories = data.rows.map(row => row.name)
        if (!data.rows.length) {
            categories = [rootCategory]
        }
        getItems(categories, (categoryItemsMap) => {
            console.log(categoryItemsMap)
            return res.status(200).json({ categoryItemsMap: categoryItemsMap })
        }, 16)
    })
})

app.post('/api/add-grocery-item', (req, res) => {
    const groceryName = req.body.groceryName
    const userEmail = req.body.userEmail
    const inputQuantity = req.body.inputQuantity
    db.get('SELECT grocery_cart FROM user where user.email=?;', [userEmail], (_, row) => {
        let cart = row.grocery_cart ? JSON.parse(row.grocery_cart) : {}
        cart[groceryName] = parseInt(inputQuantity) + parseInt(cart[groceryName] ? cart[groceryName] : 0)
        db.run('UPDATE user SET grocery_cart=? WHERE user.email=?', [JSON.stringify(cart), userEmail], (err) => {
            return res.status(200).json({})
        })
    })
})

app.get('/api/user-settings', (req, res) => {
    const userEmail = req.query[EMAIL_PROPERTY]
    db.get('SELECT full_name, email, phone, address, zip_code FROM user WHERE user.email=?;', [userEmail], (_, row) => {
        const userSettings = {
            [NAME_PROPERTY]: row.full_name,
            [EMAIL_PROPERTY]: row.email,
            [PHONE_PROPERTY]: row.phone,
            [ADDRESS_PROPERTY]: row.address,
            [ZIP_PROPERTY]: row.zip_code,
        }
        return res.status(200).json({ userSettings: userSettings })
    })
})

app.get('/api/my-cart', (req, res) => {
    const userEmail = req.query[EMAIL_PROPERTY]
    db.get('SELECT grocery_cart FROM user WHERE user.email=?;', [userEmail], (_, row) => {
        if (!row.grocery_cart) {
            return res.status(200).json({ groceryCart: {} })
        }
        return res.status(200).json({ groceryCart: JSON.parse(row.grocery_cart) })
    })
})


app.get('/api/validate-token', (req, res) => {
    const authToken = req.query['authToken']
    const email = validateJWT(authToken)
    if (!email) {
        return res.status(400).json({})
    }
    db.get('SELECT plan_name FROM user WHERE user.email=?', [email], (err, row) => {
        if (err || !row) {
            return res.status(200).json({ email: '', chosenPlan: { name: '', frequency: '' } })
        }
        if (!row.plan_name) {
            return res.status(200).json({ email: email, chosenPlan: { name: '', frequency: '' } })
        }
        db.get('SELECT frequency FROM plan WHERE plan.name=?', [row.plan_name], (err, row2) => {
            return res.status(200).json({ email: email, chosenPlan: { frequency: row2.frequency, name: row.plan_name } })
        })
    })
})


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/iterative_design/build/index.html'))
})
