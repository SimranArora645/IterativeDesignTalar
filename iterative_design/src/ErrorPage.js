import React from 'react';
import './App.css';
import Navigation from './Navigation.js'
import Footer from './Footer.js';
import { requireAuthentication } from './api'

export default class ErrorPage extends React.Component {
    state = {
        "sessionUser": {},
        "checkedAuthentication": false,
        "error": this.props.error ? this.props.error : ""
    }
    async componentDidMount() {
        requireAuthentication(userInfo => this.setState({ "sessionUser": userInfo, checkedAuthentication: true }), false)
    }
    render() {
        if (!this.state.checkedAuthentication) {
            return <div></div>
        }
        return (
            <React.Fragment>
                <Navigation signedIn={!!this.state.sessionUser.email} showSearch />
                <div className="error-page-outer">
                    <p className="error-header">{this.state.error}</p>
                    <p className="error-description">If you're seeing this page, then something went wrong.</p>
                </div>
                <Footer />
            </React.Fragment>
        )
    }
}