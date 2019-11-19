import React from 'react';
import './App.css';
import Navigation from './Navigation';
import Footer from './Footer';
import { requireAuthentication, getGroceryItems } from './api'
import GroceryItem from './GroceryItem'
import Octicon, { getIconByName } from '@primer/octicons-react'
export default class StorePage extends React.Component {
    constructor(props) {
        super(props)
        const rootCategory = this.props.match.params.category
        this.state = {
            categoryItemsMap: [],
            retrievedGroceryItems: false,
            sessionUser: {},
            checkedAuthentication: false,
            rootCategory: rootCategory ? rootCategory : 'All Items',
        }
    }

    async componentDidMount() {
        requireAuthentication(userInfo => this.setState({ "sessionUser": userInfo, checkedAuthentication: true }))
    }
    c
    clearFilters(event) {
        event.preventDefault()
        this.setState({ currentRoot: "All Items" })
    }
    render() {
        if (!this.state.checkedAuthentication) {
            return <div></div>
        }
        if (!this.state.sessionUser.email) {
            window.location.href = "/"
            return <div></div>
        }

        const groceryCallback = (categoryItemsMap) => {
            this.setState({ retrievedGroceryItems: true, categoryItemsMap: categoryItemsMap })
        }
        if (!this.state.retrievedGroceryItems) {
            getGroceryItems(this.state.rootCategory, groceryCallback)
        }

        if (!this.state.retrievedGroceryItems) {
            return <div></div>
        }

        const categories = Object.keys(this.state.categoryItemsMap)
        let listElementsHTML = ""
        if (categories.length > 1) {
            listElementsHTML = categories.map((category, idx) => {
                return <li className="filter-li" key={category + idx} id={category}>
                    <a className="filter-href" href={`/store/${category}`}>{category}</a>
                </li>
            })
            listElementsHTML.sort((el1, el2) => {
                return el1.key < el2.key ? -1 : 1
            })
        }

        const groceryListHTML = categories.map((category, idx) => {
            let categoryItems = this.state.categoryItemsMap[category]
            return <StoreSection category={category} items={categoryItems} key={category + idx}
                sessionUser={this.state.sessionUser} />
        })

        const filterHTML = <div className="grocery-filters">
            <div className="filters-header">
                <p className="filter-title">{this.state.rootCategory}</p>
                <a className="clear-filters-link" href="/store">Clear all</a>
            </div>

            <p className="main-category">{this.state.currentRoot}</p>
            <ul className="filter-ul">
                {listElementsHTML}
            </ul>
        </div>
        return (
            <div>
                <Navigation signedIn showSearch />
                <div className="grocery-list-outer">
                    {filterHTML}
                    <div className="grocery-list-inner">
                        <div className="grocery-list-header">
                            <p className="grocery-list-title">{this.state.rootCategory}</p>
                        </div>
                        <div className="grocery-list-items">
                            {groceryListHTML}
                        </div>
                    </div>

                </div>
                <Footer />
            </div>
        )
    }
}

class StoreSection extends React.Component {
    state = {
        category: this.props.category,
        items: this.props.items,
        sessionUser: this.props.sessionUser,
        index: 0,
    }
    MAX_ITEMS = 4
    nextWindow(event) {
        event.preventDefault()
        this.setState({ index: this.state.index + this.MAX_ITEMS })
    }
    previousWindow(event) {
        event.preventDefault()
        this.setState({ index: this.state.index - this.MAX_ITEMS })
    }
    render() {
        const itemHTML = this.state.items.slice(this.state.index, this.state.index + this.MAX_ITEMS).map((itemInfo, idx) => {
            return <GroceryItem itemInfo={itemInfo} key={itemInfo.name + idx} sessionUser={this.state.sessionUser}
                rowLength={this.state.items.length} />
        })
        const leftButtonHTML = this.state.index ? <button className="grocery-row-change grocery-row-change-left " onClick={this.previousWindow.bind(this)}>
            <Octicon className="icon-chevron" icon={getIconByName('chevron-left')} />
        </button> : <div className="grocery-row-change-placeholder grocery-row-change-left "></div>
        const rightbuttonHTML = this.state.index + this.MAX_ITEMS < this.state.items.length ?
            <button className="grocery-row-change grocery-row-change-right " onClick={this.nextWindow.bind(this)}>
                <Octicon className="icon-chevron" icon={getIconByName('chevron-right')} />
            </button> : <div className="grocery-row-change-placeholder grocery-row-change-right "></div>

        return <div className="grocery-row-outer">
            <p className="grocery-row-category">{this.state.category}</p>
            <div className="row grocery-row">
                {leftButtonHTML}
                {itemHTML}
                {rightbuttonHTML}
            </div>
        </div>

    }
}