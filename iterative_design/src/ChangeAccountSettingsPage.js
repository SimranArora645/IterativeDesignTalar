import React from 'react';
import './App.css';
import { requireAuthentication } from './api.js'
export default class ChangeAccountSettingsPage extends React.Component {
    state = {
        "authenticated": false,
    }
    componentDidMount() {
        const user = requireAuthentication()
        console.log(user)
    }
    render() {
        if (!this.state.authenticated) {
            return <div></div>
        }
        return (
            <div className="register-outer">

            </div >
        )
    }
}