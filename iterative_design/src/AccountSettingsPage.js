import React from 'react';
import './App.css';
import { requireAuthentication, getUserSettings } from './api.js'
import Navigation from './Navigation';
import Footer from './Footer';
import * as Constants from './constants'
import localStorage from 'local-storage'

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
        pageState: 0,
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
    async changeSettings(event) {
        event.preventDefault()
        const postParams = this.state
        postParams.userEmail = this.state.sessionUser.email
        const URLs = ["/api/change-personal-information", "/api/change-address-information", "/api/change-password"]
        await fetch(URLs[this.state.pageState], {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postParams)
        }).then(async (res) => {
            const responseBody = await res.json()
            if (responseBody.errors) {
                this.setStateForErrors(responseBody.errors)
            }
            if (responseBody.error) {
                this.setState({ error: responseBody.error })
            } else if (!responseBody.errors) {
                if (responseBody.authToken) {
                    localStorage('authToken', responseBody.authToken)
                }
                window.location.href = "/account-settings"
            }
        })
    }
    importSettings(userSettings) {
        console.log(userSettings)
        const newState = this.state
        Object.keys(userSettings).forEach((key) => {
            if (newState[key]) {
                newState[key].value = userSettings[key]
            }
        })
        this.setState(newState)
    }
    changeDisplayState(state, event) {
        event.preventDefault()
        this.setState({ pageState: state })
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
        let inputFields = []
        if (this.state.pageState === 0) {
            inputFields = [Constants.NAME_PROPERTY, Constants.EMAIL_PROPERTY, Constants.PHONE_PROPERTY]
        } else if (this.state.pageState === 1) {
            inputFields = [Constants.ADDRESS_PROPERTY, Constants.ZIP_PROPERTY,]
        } else {
            inputFields = [Constants.OLD_PASSWORD_PROPERTY, Constants.NEW_PASSWORD_PROPERTY, Constants.CONFIRM_NEW_PASSWORD_PROPERTY]
        }
        const passwordFields = [Constants.OLD_PASSWORD_PROPERTY, Constants.NEW_PASSWORD_PROPERTY, Constants.CONFIRM_NEW_PASSWORD_PROPERTY]
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
        let linkHTML = ["Personal Information", "Address Information", "Change Password"].map((el, idx) => {
            let linkClass = "nav-link account-settings-link " + (idx === this.state.pageState ? "active" : "")
            console.log(idx, linkClass)
            return (
                < li class="nav-item" >
                    <a class={linkClass} href="#" onClick={(e) => this.changeDisplayState(idx, e)}>
                        {el}
                    </a>
                </li >
            )
        })
        return (
            <React.Fragment>
                <Navigation signedIn={!!this.state.sessionUser.email} />
                <div className="account-settings-outer">
                    <div className="account-settings-form">
                        <ul class="nav nav-tabs">
                            {linkHTML}
                        </ul>
                        <form className="register-form account-settings-inputs">
                            <p className="input-error">{this.state.error}</p>
                            <div className="register-inputs">
                                {inputsHTML}
                                <button className="btn login-button" onClick={this.changeSettings.bind(this)}>Apply Changes</button>
                            </div>
                        </form>
                    </div>

                </div >
                <Footer />
            </React.Fragment >
        )
    }
}