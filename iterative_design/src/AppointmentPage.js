import React from 'react';
import './App.css';
import Navigation from './Navigation';
import Footer from './Footer';
import { requireAuthentication } from './api'

export default class AppointmentPage extends React.Component {
    state = {
        sessionUser: {},
        checkedAuthentication: false,
    }
    async componentDidMount() {
        requireAuthentication(userInfo => this.setState({ "sessionUser": userInfo, checkedAuthentication: true }))
    }
    render() {
        if (!this.state.checkedAuthentication) {
            return <div></div>
        }
        let key = "";
        return (
            <React.Fragment>
                <Navigation signedIn={!!this.state.sessionUser.email} />
                <div className="appointment-outer">
                </div>
                <Footer />
            </React.Fragment>
        )
    }
}