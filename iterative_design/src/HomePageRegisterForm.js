import React from 'react';
import { Redirect } from 'react-router-dom';
export default class HomePageRegisterForm extends React.Component {
    state = {
        shouldRegister: false,
        email: ""
    }
    inputChangeHandler = (event) => {
        const oldState = this.state
        oldState[event.target.name] = event.target.value
        this.setState(oldState)
    }
    signupHandler(event) {
        event.preventDefault()
        this.setState({ shouldRegister: true })
    }
    render() {
        if (this.state.shouldRegister) {
            console.log("?")
            return <Redirect to={{ pathname: '/register', state: { email: this.state.email } }} />
        }
        return (
            <form className="homepage-register-form" >
                <p className="homepage-register-text">Get groceries delivered straight to your doorstep.</p>
                <input className="input-group register-input" name="email" onChange={this.inputChangeHandler.bind(this)}
                    placeholder="Enter your email address" autoComplete="off" />
                <button className="btn homepage-register-button" onClick={this.signupHandler.bind(this)}>Sign up now</button>
            </form >
        )
    }
}