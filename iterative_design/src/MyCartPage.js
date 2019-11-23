import React from 'react';
import './App.css';
import { requireAuthentication, getGroceryCart, getAllGroceryItems, modifyGroceryCart } from './api.js'
import Navigation from './Navigation';
import Footer from './Footer';
import QuantityDropdown from './QuantityDropdown'
export default class MyCartPage extends React.Component {
    state = {
        "sessionUser": {},
        "checkedAuthentication": false,
        retrievedCart: false,
        groceryCart: {},
        retrievedGroceryItems: false,
        groceryItems: [],
    }

    async componentDidMount() {
        requireAuthentication(userInfo => this.setState({ "sessionUser": userInfo, checkedAuthentication: true }), false)
    }
    updateCallback(itemName, newQuantity) {
        modifyGroceryCart(this.state.sessionUser.email, itemName, newQuantity, false, () => {
            let newGroceryCart = this.state.groceryCart
            newGroceryCart[itemName] = newQuantity
            let newCartCount = Object.keys(newGroceryCart).reduce((acc, item) => {
                return acc + parseInt(newGroceryCart[item])
            }, 0)
            let newSessionUser = this.state.sessionUser
            newSessionUser.cartCount = newCartCount
            this.setState({ groceryCart: newGroceryCart, sessionUser: newSessionUser })
        })
    }
    render() {
        if (!this.state.checkedAuthentication) {
            return <div></div>
        }
        if (!this.state.sessionUser.email) {
            window.location.href = "/"
            return <div></div>
        }
        if (!this.state.retrievedCart) {
            getGroceryCart(this.state.sessionUser.email,
                (groceryCart) => this.setState({ retrievedCart: true, "groceryCart": groceryCart }))
        }
        if (!this.state.retrievedGroceryItems) {
            getAllGroceryItems((groceryItems) => this.setState({ retrievedGroceryItems: true, groceryItems: groceryItems }))
        }

        if (!this.state.retrievedGroceryItems || !this.state.retrievedCart) {
            return <div></div>
        }
        const planText = this.state.sessionUser.chosenPlan.name ? `Your current plan is the ${this.state.sessionUser.chosenPlan.name}. 
        ${this.state.sessionUser.chosenPlan.frequency}, the following cart of groceries will be delivered.` :
            <span>You have not selected a delivery plan yet, <a className="pricing-redirect" href="/pricing">choose one here</a>.</span>
        let cartCost = 0
        const listHTML = Object.keys(this.state.groceryCart).filter((key) => {
            return this.state.groceryCart[key] !== 0
        }).map((key) => {
            let groceryItem = this.state.groceryItems.find(el => el.name === key)
            let itemCost = groceryItem.price.toFixed(2)
            let totalCost = (parseFloat(itemCost) * parseInt(this.state.groceryCart[key])).toFixed(2)
            cartCost += parseFloat(totalCost)
            return <tr key={key}>
                <td>{`${key}`}</td>
                <td className="cart-table-price-item">${itemCost}</td>
                <td className="cart-table-quantity-item"><QuantityDropdown inputQuantity={this.state.groceryCart[key]}
                    updateCallback={(quantity) => this.updateCallback(key, quantity)} minQuantity={0} /></td>
                <td className="cart-table-price-item">${totalCost}</td>
            </tr>
        })
        return (
            <React.Fragment>
                <Navigation sessionUser={this.state.sessionUser} />
                <div className="plans-outer">
                    <p className="cart-title">Shopping Cart</p>
                    <p className="cart-delivery">Delivery Plan: {planText}</p>
                    <div className="cart-list">
                        <p className="cart-list-title">Items</p>
                        <div className="cart-table-container">
                            <table className="table cart-table">
                                <thead>
                                    <tr>
                                        <th scope="col">Item</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Quantity</th>
                                        <th scope="col">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listHTML}
                                    <tr col="4">
                                        <th scope="col">Whole Cart</th>
                                        <th scope="col"></th>
                                        <th scope="col"></th>
                                        <th scope="col">${cartCost.toFixed(2)}</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Footer />
            </React.Fragment>
        )
    }
}