import React from 'react';
import Octicon, { Search } from '@primer/octicons-react'
import UserSettingsDropdown from './UserSettingsDropdown.js'
export default class Navigation extends React.Component {
    constructor(props) {
        super(props)
        this.state = { "signedIn": props.signedIn, shouldSearch: false, isHomePage: props.isHomePage }
    }
    componentDidUpdate(props) {
        if (props.signedIn !== this.state.signedIn) {
            this.setState({ "signedIn": props.signedIn })
        }
    }

    render() {
        let searchHTML = ""
        let navbarUrlLabel = {
            "/register": "Sign up",
            "/login": "Log in",
            "/pricing": "Pricing Plans",
            "/privacy-policy": "Privacy Policy"
        }
        let navbarOuterClass = this.state.isHomePage ? "homepage-navbar-item-outer" : "navbar-item-outer"
        let navbarItemClass = this.state.isHomePage ? "homepage-navbar-item" : "navbar-item"
        if (this.state.signedIn) {
            navbarUrlLabel = {
                "/": "Log Out",
                "/my-cart": "My Cart",
                "/store": "Store",
                "/pricing": "Pricing Plans",
                "/privacy-policy": "Privacy Policy"
            }
            if (this.state.shouldSearch) {
                searchHTML = <div className="input-search-container">
                    <Octicon icon={Search} className="icon-search" />
                    <input className="input-search" placeholder="Search"></input>
                </div>
            }

        }
        const navbarHTML = Object.keys(navbarUrlLabel).map((url, idx) => {
            let label = navbarUrlLabel[url]
            if (url === "/") {
                return <UserSettingsDropdown key="dropdown" />
            }
            return (<div className={navbarOuterClass} key={idx}>
                <a className={"navbar-brand " + navbarItemClass} href={url} >{label}</a>
            </div>)
        })
        const navClass = this.state.isHomePage ? "" : "standard-navbar-header"
        const logoClass = this.state.isHomePage ? "homepage-navbar-logo" : ""
        return (
            <nav className={"navbar navbar-expand-lg homepage-navbar " + navClass}>
                <a className={"navbar-brand navbar-logo " + logoClass} href="/">Talar</a>

                <div className="navbar-items">
                    {navbarHTML}
                    {searchHTML}
                </div>

            </nav>
        )
    }
}

