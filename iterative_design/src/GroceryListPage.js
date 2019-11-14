import React from 'react';
import './App.css';
import Navigation from './Navigation';
import Footer from './Footer';
import { requireAuthentication, getPlans } from './api'
import GroceryItem from './GroceryItem'
import Octicon, { Check } from '@primer/octicons-react'

export default class GroceryListPage extends React.Component {
    state = {
        "groceryItems": [],
        "sessionUser": {},
        "retrievedGroceries": false,
    }
    async componentDidMount() {
        requireAuthentication(userInfo => this.setState({ "sessionUser": userInfo }))
    }
    async addGroceryHandler(event) {
        const groceryName = event.target.name
    }
    render() {
        if (!this.state.sessionUser || !this.state.sessionUser.email) {
            return <div></div>
        }
        const plansCallback = (pricingPlans) => {
            this.setState({ "retrievedPlans": true, "pricingPlans": pricingPlans })
        }
        if (!this.state.retrievedPlans) {
            getPlans(plansCallback)
        }
        let key = "";
        const groceryListHTML = this.state.groceryItems.map((item) => {
            return <GroceryItem itemInfo={item} />
        })
        const filters = ["Root Vegetables", "Fruits"]
        const filtersHTML = filters.map((filterName) => {
            return <div className="filter-item">{filterName}</div>
        })
        return (
            <div>
                <Navigation signedIn showSearch />
                <div className="grocery-list-outer">
                    <div className="grocery-filters">
                        {filtersHTML}
                    </div>
                    <div className="grocery-list-items">
                        {groceryListHTML}
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}