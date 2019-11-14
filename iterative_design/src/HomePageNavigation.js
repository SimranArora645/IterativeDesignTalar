import React from 'react';

export default class HomePageNavigation extends React.Component {
    constructor(props) {
        super(props)
        this.state = { "signedIn": props.signedIn, shouldSearch: props.shouldSearch }
    }
    componentDidUpdate(props) {
        if (props.signedIn !== this.state.signedIn) {
            this.setState({ "signedIn": props.signedIn })
        }
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
                "/logout": "Log Out",
                "/pricing": "Pricing",
                "/grocery-list": "Groceries",
            }
        }
        const navbarHTML = Object.keys(navbarUrlLabel).map((url, idx) => {
            let label = navbarUrlLabel[url]
            return <div className="homepage-navbar-item-outer" key={idx}>
                <a className="navbar-brand homepage-navbar-item" href={url}>{label}</a>
            </div>
        })
        return (
            <nav className="navbar navbar-expand-lg homepage-navbar">
                <a className="navbar-brand navbar-logo homepage-navbar-logo" href="/">Talar</a>
                <div className="navbar-items">
                    {navbarHTML}
                </div>
            </nav>
        )
    }
}