import React from 'react';
import localStorage from 'local-storage'

export default class Navigation extends React.Component {
    constructor(props) {
        super(props)
        this.state = { "signedIn": props.signedIn, shouldSearch: props.shouldSearch }
    }
    componentDidUpdate(props) {
        if (props.signedIn !== this.state.signedIn) {
            console.log(props)
            this.setState({ "signedIn": props.signedIn })
        }
    }
    logoutHandler() {
        localStorage('authToken', '')
    }
    render() {
        let navbarUrlLabel = {
            "/register": "Sign up",
            "/login": "Log in",
            "/help": "Help",
            "/grocery-options": "Grocery Options",
            "/pricing": "Pricing",
        }
        if (this.state.signedIn) {
            navbarUrlLabel = {
                "/": "Log Out",
                "/pricing": "Pricing",
                "/grocery-list": "Groceries",
            }
        }
        const navbarHTML = Object.keys(navbarUrlLabel).map((url, idx) => {
            let label = navbarUrlLabel[url]
            if (url == "/") {
                return (<div className="navbar-item-outer" key={idx}>
                    <a className="navbar-brand navbar-item" href={url} onClick={this.logoutHandler.bind(this)}>{label}</a>
                </div>)
            }
            return (<div className="navbar-item-outer" key={idx}>
                <a className="navbar-brand navbar-item" href={url} >{label}</a>
            </div>)
        })
        return (
            <nav className="navbar navbar-expand-lg standard-navbar-header homepage-navbar">
                <a className="navbar-brand navbar-logo" href="/">Talar</a>
                <div className="navbar-items">
                    {navbarHTML}
                </div>
            </nav>
        )
    }
}

