import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import HomePage from './HomePage';
import PricingPage from './PricingPage';
import ContactUsPage from './ContactUsPage';
import HelpPage from './HelpPage';
import PrivacyPolicyPage from './PrivacyPolicyPage'
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import AccountSettingsPage from './AccountSettingsPage'
import StorePage from './StorePage'
import GroceryOptionsPage from './GroceryOptionsPage'
import AppointmentPage from './AppointmentPage'
import MyCartPage from './MyCartPage'
import {
    BrowserRouter,
    Route,
    Switch,
    Redirect,
} from 'react-router-dom';

const routes = {
    "/": HomePage,
    "/contact-us": ContactUsPage,
    "/help": HelpPage,
    "/login": LoginPage,
    "/register": RegisterPage,
    "/privacy-policy": PrivacyPolicyPage,
    "/grocery-options": GroceryOptionsPage,
    "/account-settings": AccountSettingsPage,
    '/store': StorePage,
    "/pricing": PricingPage,
    "/appointment": AppointmentPage,
    "/my-cart": MyCartPage,
}
const routeHTML = Object.keys(routes).map((url) => {
    return <Route exact path={url} key={url} component={routes[url]} />
})
ReactDOM.render(
    <BrowserRouter>
        <Switch>
            {routeHTML}
            <Route path='/'>
                <Redirect to="/" />
            </Route>
        </Switch>
    </BrowserRouter>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
