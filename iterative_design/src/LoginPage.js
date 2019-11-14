import React from 'react';
import './App.css';
import * as Constants from './constants'
import localStorage from 'local-storage'
import Navigation from './Navigation';
import Footer from './Footer';
import { requireAuthentication } from './api'
import { Redirect } from 'react-router-dom';
export default class LoginPage extends React.Component {
    state = {
        [Constants.EMAIL_PROPERTY]: "",
        [Constants.PASSWORD_PROPERTY]: "",
        error: "",
        "sessionUser": {},
        "checkedAuthentication": false,
    }
    async componentDidMount() {
        requireAuthentication(userInfo => this.setState({ "sessionUser": userInfo, checkedAuthentication: true }), false)
    }
    loginHandler = async (event) => {
        event.preventDefault()
        const postParams = {
            [Constants.EMAIL_PROPERTY]: this.state[Constants.EMAIL_PROPERTY],
            [Constants.PASSWORD_PROPERTY]: this.state[Constants.PASSWORD_PROPERTY],
        }
        await fetch("/api/login", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postParams)
        }).then(async (res) => {
            const responseBody = await res.json()
            if (responseBody.error) {
                this.setState({ error: responseBody.error })
            } else {
                localStorage('authToken', responseBody.authToken)
                window.location.href = "/grocery-list"
            }
        })
    }
    inputChangeHandler = (event) => {
        const oldState = this.state
        oldState[event.target.name] = event.target.value
        this.setState(oldState)
    }
    render() {
        if (!this.state.checkedAuthentication) {
            return <div></div>
        }
        if (this.state.sessionUser.email) {
            return <Redirect to="/pricing" />
        }
        const fieldInputs = [Constants.EMAIL_PROPERTY, Constants.PASSWORD_PROPERTY]
        let inputsHTML = fieldInputs.map((inputLabel) => {
            let inputType = (inputLabel === Constants.PASSWORD_PROPERTY) ? "password" : "text"
            return (
                <div key={inputLabel}>
                    <p className="register-input-label">{inputLabel}</p>
                    <input className="input-group register-input" name={inputLabel} autoComplete="off" type={inputType} onChange={this.inputChangeHandler.bind(this)} />
                </div>
            )
        })
        let stateHTML = (
            <form className="register-form register-form0">
                <p className="login-title">Sign in to your existing account</p>
                <p className="input-error">{this.state.error}</p>
                <div className="register-inputs">
                    {inputsHTML}
                    <button className="btn login-button" onClick={this.loginHandler.bind(this)}>Sign in</button>
                </div>
            </form>
        )
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

