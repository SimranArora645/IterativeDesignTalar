import React from 'react';
import Octicon, { Check } from '@primer/octicons-react'
import QuantityDropdown from './QuantityDropdown'
export default class GroceryItem extends React.Component {
    constructor(props) {
        super(props)
        console.log(this.props.cartUpdateCallback)
        this.state = {
            cartUpdateCallback: props.cartUpdateCallback,
            image: props.itemInfo.image,
            name: props.itemInfo.name,
            price: props.itemInfo.price,
            quantity: props.itemInfo.quantity,
            quantityUnits: props.itemInfo.quantity_units,
            source: props.itemInfo.source,
            sessionUser: props.sessionUser,
            hasBought: false,
            useGridFormat: props.useGridFormat,
            inputQuantity: 1,
        }
    }
    async buyItem(event) {
        event.preventDefault()
        let postParams = {
            userEmail: this.state.sessionUser.email,
            groceryName: this.state.name,
            inputQuantity: this.state.inputQuantity
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
                this.state.cartUpdateCallback(postParams.inputQuantity)
                this.setState({ hasBought: true })
            }
        })
    }
    updateInputQuantity(inputQuantity) {
        this.setState({ inputQuantity: inputQuantity })
    }
    render() {
        const groceryImagePath = "/grocery_images/"
        const itemStyle = { backgroundImage: `url(${groceryImagePath + this.state.image})` }
        const perUnitCost = (parseFloat(this.state.price) / this.state.quantity).toFixed(2)
        const buttonText = this.state.hasBought ? <Octicon icon={Check} /> :
            'Add to Cart'
        let singularItem = this.state.quantityUnits
        if (singularItem.length && singularItem.slice(-1) === "s") {
            singularItem = singularItem.slice(0, -1)
        }
        const perItemCostHTML = parseInt(this.state.quantity) === 1 ? ""
            : <p className="grocery-item-per-unit-price">(${perUnitCost} / {singularItem})</p>

        const gridItemClass = this.state.useGridFormat ? "grocery-item-grid" : "grocery-item-column col"
        return (
            <div className={gridItemClass}>
                <div className="grocery-item-image" style={itemStyle}>
                </div>
                <div className="grocery-item-description">
                    <p className="grocery-item-title">{`${this.state.name}, ${this.state.quantity} ${this.state.quantityUnits}`}</p>
                    <div className="grocery-item-price-container">
                        <p className="grocery-item-price">{`$${this.state.price.toFixed(2)}`}</p>
                        {perItemCostHTML}
                    </div>
                    <p className="grocery-item-source">{`Sourced from ${this.state.source}`}</p>
                    <div className="grocery-add-container">
                        <QuantityDropdown inputQuantity={this.state.inputQuantity} updateCallback={this.updateInputQuantity.bind(this)} />
                        <div className="input grocery-add-button" onClick={this.buyItem.bind(this)}>
                            {buttonText}
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}