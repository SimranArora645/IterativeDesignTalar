import { Dropdown } from 'react-bootstrap'
import React from 'react'
import * as Constants from './constants';

export default class QuantityDropdown extends React.Component {
    state = {
        updateCallback: this.props.updateCallback,
        inputQuantity: this.props.inputQuantity,
        minQuantity: this.props.minQuantity,
        showQuantityInput: false,
        inputValue: "",
    }
    componentDidUpdate() {
        if (this.props.inputQuantity !== this.state.inputQuantity) {
            this.setState({ inputQuantity: this.props.inputQuantity });
        }
    }
    dropdownUpdate(event) {
        event.preventDefault()
        const inputQuantity = parseInt(event.target.getAttribute('quantity'))
        this.state.updateCallback(inputQuantity)
        if (inputQuantity === Constants.MAX_ADD_COUNT) {
            this.setState({ showQuantityInput: true })
        }
    }
    inputUpdate(event) {
        event.preventDefault()
        this.state.updateCallback(this.state.inputValue)
        this.setState({ showQuantityInput: false, inputValue: "" })
    }
    setInput(event) {
        event.preventDefault()
        const regexNumber = /^[0-9]{1,3}$/
        if (event.target.value.match(regexNumber)) {
            this.setState({ inputValue: event.target.value })
        }
    }
    render() {
        let dropdownItems = []
        if (this.state.showQuantityInput) {
            return <div className="quantity-input-container">
                <input className="quantity-input" value={this.state.inputValue}
                    onChange={this.setInput.bind(this)} />
                <p className="quantity-input-update" onClick={this.inputUpdate.bind(this)}>Update</p>
            </div>
        }
        for (let quantity = 0; quantity <= Constants.MAX_ADD_COUNT; quantity++) {
            let optionText = quantity
            if (quantity === 0) {
                optionText += " (Remove)"
            } else if (quantity === Constants.MAX_ADD_COUNT) {
                optionText += "+"
            }
            dropdownItems.push(
                <Dropdown.Item className="quantity-dropdown-item" key={quantity} quantity={quantity}
                    onClick={this.dropdownUpdate.bind(this)}>
                    <p className="quantity-dropdown-item-text" quantity={quantity}>{optionText}</p>
                </Dropdown.Item>
            )
        }
        return (
            <Dropdown className="quantity-dropdown-outer" drop="down">
                <Dropdown.Toggle className="quantity-dropdown" variant="none">
                    <p className="quantity-dropdown-label">Qty:</p>
                    <p className="quantity-dropdown-text">{this.state.inputQuantity}</p>
                </Dropdown.Toggle>
                <Dropdown.Menu alignRight className="quantity-dropdown-menu">
                    {dropdownItems}
                </Dropdown.Menu>
            </ Dropdown>)
    }
}