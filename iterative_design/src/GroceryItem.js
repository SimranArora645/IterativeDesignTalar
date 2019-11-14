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
            sessionUser: props.sessionUser,
            inputQuantity: 1,
            boughtItem: false,
        }
    }
    async buyItem(event) {
        event.preventDefault()

        let postParams = {
            userEmail: this.state.sessionUser.email,
            groceryName: this.state.name,
            inputQuantity: this.state.inputQuantity
        }
        console.log(postParams)
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
                console.log(responseBody.errors)
                alert("An error occurred.")
            } else {
                this.setState({ boughtItem: true })
            }
        })
    }
    inputChangeHandler = (event) => {
        this.setState({ inputQuantity: event.target.value })
    }
    render() {
        const groceryImagePath = "/grocery_images/"
        const itemStyle = { backgroundImage: `url(${groceryImagePath + this.state.image})` }
        const totalCost = (parseFloat(this.state.price) * parseInt(this.state.quantity)).toFixed(2)
        const buttonText = this.state.boughtItem ? <Octicon icon={Check}
            className="bought-check-icon" /> : "Add to Cart"
        return (
            <div className="grocery-item" >
                <div className="grocery-item-image" style={itemStyle}>

                </div>
                <div className="grocery-item-description">
                    <p className="grocery-item-title">{`${this.state.quantity} ${this.state.name}`}</p>
                    <p>Per-cost: ${this.state.price} / item</p>
                </div>
                <form className="grocery-item-footer" >
                    <p className="grocery-item-price">{`$${totalCost}`}</p>
                    <div className="add-grocery-container">
                        Qty: <input className="input-add-quantity" placeholder="1" onChange={this.inputChangeHandler.bind(this)}></input>
                        <div className="input grocery-add-button" onClick={this.buyItem.bind(this)}>{buttonText}</div>
                    </div>
                </form>
            </div>
        )
    }
}