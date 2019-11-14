import React from 'react';
import './App.css';
import { requireAuthentication, getUserSettings } from './api.js'
import Navigation from './Navigation';
import Footer from './Footer';
import * as Constants from './constants'

export default class AccountSettingsPage extends React.Component {
    state = {
        [Constants.ZIP_PROPERTY]: { value: "", error: "" },
        [Constants.NAME_PROPERTY]: { value: "", error: "" },
        [Constants.EMAIL_PROPERTY]: { value: "", error: "" },
        [Constants.OLD_PASSWORD_PROPERTY]: { value: "", error: "" },
        [Constants.NEW_PASSWORD_PROPERTY]: { value: "", error: "" },
        [Constants.PHONE_PROPERTY]: { value: "", error: "" },
        [Constants.CONFIRM_NEW_PASSWORD_PROPERTY]: { value: "", error: "" },
        [Constants.ADDRESS_PROPERTY]: { value: "", error: "" },
        sessionUser: {},
        checkedAuthentication: false,
        retrievedSettings: false,
    }

    async componentDidMount() {
        requireAuthentication(userInfo => this.setState({ "sessionUser": userInfo, checkedAuthentication: true }), false)
    }
    inputChangeHandler = (event) => {
        const oldState = this.state
        oldState[event.target.name].value = event.target.value
        this.setState(oldState)
    }
    setStateForErrors(errors) {
        let newState = this.state
        Constants.INPUT_FIELDS.forEach((key) => {
            newState[key].error = ""
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
    importSettings(userSettings) {
        const newState = this.state
        Object.keys(userSettings).forEach((key) => {
            if (newState[key]) {
                newState[key].value = userSettings[key]
            }
        })
        this.setState(newState)
    }
    settingsHandler(event) {

    }
    render() {
        if (!this.state.checkedAuthentication) {
            return <div></div>
        }
        if (!this.state.sessionUser.email) {
            window.location.href = "/"
        }

        const settingsCallback = (userSettings) => {
            this.importSettings(userSettings)
            this.setState({ retrievedSettings: true })
        }
        if (!this.state.retrievedSettings) {
            getUserSettings(this.state.sessionUser.email, settingsCallback)
            return <div></div>
        }

        const inputFields = [Constants.NAME_PROPERTY, Constants.EMAIL_PROPERTY, Constants.PHONE_PROPERTY,
        Constants.ADDRESS_PROPERTY, Constants.ZIP_PROPERTY,
        Constants.OLD_PASSWORD_PROPERTY, Constants.NEW_PASSWORD_PROPERTY, Constants.CONFIRM_NEW_PASSWORD_PROPERTY]
        const passwordFields = [Constants.OLD_PASSWORD_PROPERTY, Constants.NEW_PASSWORD_PROPERTY, Constants.CONFIRM_NEW_PASSWORD_PROPERTY]
        console.log(this.state)
        let inputsHTML = inputFields.map((inputLabel) => {
            let inputType = passwordFields.includes(inputLabel) ? "password" : "text"
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
        return (
            <React.Fragment>
                <Navigation signedIn={!!this.state.sessionUser.email} />
                <div className="account-settings-outer">
                    <form className="register-form account-settings-form">
                        <p className="login-title">Account Settings</p>
                        <p className="input-error">{this.state.error}</p>
                        <div className="register-inputs">
                            {inputsHTML}
                            <button className="btn login-button" onClick={this.settingsHandler.bind(this)}>Apply Changes</button>
                        </div>
                    </form>
                </div >
                <Footer />
            </React.Fragment>
        )
    }
}