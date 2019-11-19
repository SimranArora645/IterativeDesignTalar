import { Dropdown } from 'react-bootstrap'
import React from 'react'
import Octicon, { Gear } from '@primer/octicons-react'
import localStorage from 'local-storage'
export default class UserSettingsDropdown extends React.Component {
    logoutHandler(event) {
        event.preventDefault()
        localStorage('authToken', '')
        window.location.href = "/"
    }
    render() {
        return (<Dropdown >
            <Dropdown.Toggle as={UserImage}>
            </Dropdown.Toggle>

            <Dropdown.Menu alignRight>
                <Dropdown.Item href='/account-settings'>
                    <p className="user-settings-menu-item" >Account Settings</p>
                </Dropdown.Item>
                <Dropdown.Item onClick={this.logoutHandler.bind(this)}>
                    <p className="user-settings-menu-item" >Log Out</p>
                </Dropdown.Item>

            </Dropdown.Menu>
        </Dropdown>)
    }
}

class UserImage extends React.Component {
    clickHandler(e) {
        e.preventDefault();
        this.props.onClick(e);
    }
    render() {
        return (
            <div className="user-settings-container navbar-item" onClick={this.clickHandler.bind(this)}>
                <div className="user-settings-person-icon"></div>
            </div>

        );
    }
}