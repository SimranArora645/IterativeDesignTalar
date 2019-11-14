import React from 'react';
import './App.css';
import localStorage from 'local-storage'
import { generateGetQuery } from './api.js'
import Navigation from './Navigation';
import Footer from './Footer';
import * as Constants from './constants'
import { requireAuthentication } from './api'
import { Redirect } from 'react-router-dom';
export default class RegisterPage extends React.Component {
    state = {
        "registerState": 0,
        [Constants.ZIP_PROPERTY]: { value: "", error: "" },
        [Constants.NAME_PROPERTY]: { value: "", error: "" },
        [Constants.EMAIL_PROPERTY]: { value: "", error: "" },
        [Constants.PASSWORD_PROPERTY]: { value: "", error: "" },
        [Constants.PHONE_PROPERTY]: { value: "", error: "" },
        [Constants.CONFIRM_PASSWORD_PROPERTY]: { value: "", error: "" },
        [Constants.ADDRESS_PROPERTY]: { value: "", error: "" },
        "sessionUser": {},
        "checkedAuthentication": false,
    }

    constructor(props) {
        super(props)
        if (props.location && props.location.state) {
            this.state[Constants.EMAIL_PROPERTY].value = props.location.state.email
        }
    }
    async componentDidMount() {
        requireAuthentication(userInfo => this.setState({ "sessionUser": userInfo, checkedAuthentication: true }), false)
    }

    setStateForErrors(errors) {
        let newState = this.state
        Constants.INPUT_FIELDS.forEach((key) => {
            if (newState[key]) {
                newState[key].error = ""
            }
        })
        if (errors) {
            Object.keys(errors).forEach((key) => {
                newState[key].error = errors[key]
            })
            this.setState(newState)
        } else {
            newState.registerState += 1
            this.setState(newState)
        }
    }
    async nextState(event) {
        event.preventDefault()
        let getParams = { [Constants.ZIP_PROPERTY]: this.state[Constants.ZIP_PROPERTY].value }
        await fetch(generateGetQuery("/api/validate-zipcode", getParams)).then(async (res) => {
            const responseBody = await res.json()
            this.setStateForErrors(responseBody.errors)
        })
    }
    inputChangeHandler = (event) => {
        const oldState = this.state
        oldState[event.target.name].value = event.target.value
        this.setState(oldState)
    }
    selectChangeHandler = (event) => {
        const oldState = this.state
        const selectElement = event.target
        oldState[selectElement.name].value = selectElement.options[selectElement.selectedIndex].value
        this.setState(oldState)
    }
    registerHandler = async (event) => {
        event.preventDefault()
        let postParams = this.state
        await fetch("/api/register", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postParams)
        }).then(async (res) => {
            const responseBody = await res.json()
            if (responseBody.errors) {
                console.log(responseBody.errors)
                this.setStateForErrors(responseBody.errors)
            } else {
                localStorage('authToken', responseBody.authToken)
                window.location.href = "/pricing"
            }
        })
    }
    render() {
        let stateHTML = ""
        if (!this.state.checkedAuthentication) {
            return <div></div>
        }
        if (this.state.sessionUser.email) {
            return <Redirect to="/pricing" />
        }
        if (this.state.registerState === 0) {
            stateHTML = (
                <form className="register-form register-form0" onSubmit={this.nextState.bind(this)}>
                    <p className="register-title">See if we serve your area</p>
                    <div className="register-inputs-state0">
                        <input id="address-input" className="input-group" name={Constants.ADDRESS_PROPERTY} placeholder="Your street address"
                            autoComplete="off" onChange={this.inputChangeHandler.bind(this)} />
                        <input id="zip-input" className="input-group register-input-state0" name={Constants.ZIP_PROPERTY} autoComplete="off"
                            onChange={this.inputChangeHandler.bind(this)} placeholder="Zip code" />
                    </div>
                    <p className="input-error">{this.state[Constants.ZIP_PROPERTY].error}</p>
                    <button className="btn register-next-button">Check Availability</button>
                </form>
            )
        } else {
            const state1Inputs = [Constants.NAME_PROPERTY, Constants.EMAIL_PROPERTY, Constants.PHONE_PROPERTY, Constants.PASSWORD_PROPERTY, Constants.CONFIRM_PASSWORD_PROPERTY]

            let inputsHTML = state1Inputs.map((inputLabel) => {
                let inputType = (inputLabel === Constants.PASSWORD_PROPERTY || inputLabel === Constants.CONFIRM_PASSWORD_PROPERTY) ? "password" : "text"
                return (
                    <div key={inputLabel}>
                        <p className="register-input-label">{inputLabel}</p>
                        <input className="input-group register-input" name={inputLabel}
                            autoComplete="off" type={inputType} onChange={this.inputChangeHandler.bind(this)}
                            value={this.state[inputLabel].value} />
                        <p className="input-error">{this.state[inputLabel].error}</p>
                    </div>
                )
            })
            stateHTML = (
                <form className="register-form register-form1" onSubmit={this.registerHandler.bind(this)}>
                    <p className="register-title">Create your Talar Account Now</p>
                    <div className="register-inputs">
                        {inputsHTML}
                        <button className="btn register-finish-button">Create Account</button>
                    </div>
                </form>
            )
        }
        return (
            <React.Fragment>
                <Navigation />
                <div className="register-outer">
                    {stateHTML}
                </div >
                <Footer />
            </React.Fragment>
        )
    }
}