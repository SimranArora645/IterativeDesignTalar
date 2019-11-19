import React from 'react';
import Octicon, { Check } from '@primer/octicons-react'
export default class GroceryItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            image: props.itemInfo.image,
            name: props.itemInfo.name,
            price: props.itemInfo.price,
            quantity: props.itemInfo.quantity,
            quantityUnits: props.itemInfo.quantity_units,
            source: props.itemInfo.source,
            sessionUser: props.sessionUser,
            hasBought: false,
        }
    }
    async buyItem(event) {
        event.preventDefault()

        let postParams = {
            userEmail: this.state.sessionUser.email,
            groceryName: this.state.name,
            inputQuantity: 1
        }
        await fetch("/api/add-grocery-item", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postParams)
        }).then(async (res) => {
            const responseBody = await res.json()
            if (responseBody.errors) {
                alert("An error occurred.")
            } else {
                this.setState({ hasBought: true })
            }
        })
    }
    render() {
        const groceryImagePath = "/grocery_images/"
        const itemStyle = { backgroundImage: `url(${groceryImagePath + this.state.image})` }
        const totalCost = (parseFloat(this.state.price) * parseInt(this.state.quantity)).toFixed(2)
        const buttonText = this.state.hasBought ? <Octicon icon={Check} /> :
            'Add to Cart'

        const perItemCostHTML = parseInt(this.state.quantity) === 1 ? "" : <p className="grocery-item-per-unit-price">${this.state.price.toFixed(2)} / item</p>
        return (
            <div className="grocery-item col" >
                <div className="grocery-item-image" style={itemStyle}>
                </div>
                <div className="grocery-item-description">
                    <p className="grocery-item-title">{`${this.state.name}, ${this.state.quantity} ${this.state.quantityUnits}`}</p>
                    <div className="grocery-item-price-container">
                        <p className="grocery-item-price">{`$${totalCost}`}</p>
                        {perItemCostHTML}
                    </div>
                    <p className="grocery-item-source">{`Sourced from ${this.state.source}`}</p>
                    <div className="input grocery-add-button" onClick={this.buyItem.bind(this)}>
                        {buttonText}
                    </div>
                </div>
            </div>
        )
    }
}