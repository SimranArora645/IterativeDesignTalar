import { Dropdown } from 'react-bootstrap'
import React from 'react'
import * as Constants from './constants'

export default class SortDropdown extends React.Component {
    state = {
        sortCallback: this.props.sortCallback,
        currentSort: this.props.currentSort,
    }
    clickHandler(event) {
        event.preventDefault()
        const nextSort = event.target.getAttribute('sortoption')
        this.setState({ currentSort: nextSort })
        this.state.sortCallback(nextSort)
    }
    render() {
        const dropdownItems = Constants.SORT_OPTIONS.map((sortOption) => {
            return <Dropdown.Item key={sortOption} sortoption={sortOption} onClick={this.clickHandler.bind(this)}>
                <p className="sort-dropdown-item-text" sortoption={sortOption}>{sortOption}</p>
            </Dropdown.Item>
        })
        return (
            <Dropdown className="sort-dropdown-outer" drop="down">
                <Dropdown.Toggle className="sort-dropdown" variant="none">
                    <p className="sort-dropdown-text">{`Sort by: ${this.state.currentSort}`}</p>
                </Dropdown.Toggle>
                <Dropdown.Menu alignRight>
                    {dropdownItems}
                </Dropdown.Menu>
            </ Dropdown>)
    }
}