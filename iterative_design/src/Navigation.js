import React from 'react';
import Octicon, { Search } from '@primer/octicons-react'
import UserSettingsDropdown from './UserSettingsDropdown.js'
export default class Navigation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sessionUser: props.sessionUser ? props.sessionUser : {},
        }
    }
    render() {
        let searchHTML = ""
        let navbarUrlLabel = {
            "/login": "Log in",
            "/register": "Sign Up",
            "/help": "Help",
            "/pricing": "Pricing",
        }
        const currentURL = window.location.pathname + window.location.search
        const isHomePage = currentURL === "/"
        let navbarItemClass = isHomePage ? "homepage-navbar-item" : "navbar-item"
        if (this.state.sessionUser.email) {
            navbarUrlLabel = {
                "/my-cart": "My Cart",
                "/": "Account Settings",
                "/store": "Store",
                "/help": "Help",
                "/pricing": "Pricing"
            }
            if (this.state.shouldSearch) {
                searchHTML = <div className="input-search-container">
                    <Octicon icon={Search} className="icon-search" />
                    <input className="input-search" placeholder="Search"></input>
                </div>
            }

        }
        const cartCountHTML = <div className="cart-count">
            {this.state.sessionUser.cartCount < 99 ? this.state.sessionUser.cartCount : "99+"}
        </div>
        const navbarHTML = Object.keys(navbarUrlLabel).map((url, idx) => {
            let label = navbarUrlLabel[url]
            if (url === "/") {
                return <UserSettingsDropdown key="dropdown" />
            }

            if (url === "/my-cart") {
                return <a className={"navbar-brand " + navbarItemClass + ' navbar-cart'} href={url} key={idx}>
                    <span className="navbar-cart-item"></span>
                    {cartCountHTML}
                </a>
            }
            return <a className={"navbar-brand " + navbarItemClass} href={url} key={idx}>{label}</a>
        })
        const navClass = isHomePage ? "" : "standard-navbar-header"
        const logoClass = isHomePage ? "homepage-navbar-logo" : ""
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
