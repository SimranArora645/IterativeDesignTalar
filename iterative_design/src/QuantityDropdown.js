import { Dropdown } from 'react-bootstrap'
import React from 'react'

export default class QuantityDropdown extends React.Component {
    state = {
        updateCallback: this.props.updateCallback,
        inputQuantity: this.props.inputQuantity,
    }
    shouldComponentUpdate(props) {
        return true
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
    }
    render() {
        let dropdownItems = []
        const maxAddCount = 5
        for (let quantity = 1; quantity < maxAddCount; quantity++) {
            dropdownItems.push(
                <Dropdown.Item className="quantity-dropdown-item" key={quantity} quantity={quantity}
                    onClick={this.dropdownUpdate.bind(this)}>
                    <p className="quantity-dropdown-item-text" quantity={quantity}>{quantity}</p>
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