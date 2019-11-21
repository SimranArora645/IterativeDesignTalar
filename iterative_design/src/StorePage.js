import React from 'react';
import './App.css';
import Navigation from './Navigation';
import Footer from './Footer';
import { requireAuthentication, getGroceryItems, getCategoryPath } from './api'
import GroceryItem from './GroceryItem'
import Octicon, { getIconByName } from '@primer/octicons-react'
import ErrorPage from './ErrorPage'
import * as Constants from './constants'
import SortDropdown from './SortDropdown'
export default class StorePage extends React.Component {
    ROOT_CATEGORY = 'Grocery Items'
    constructor(props) {
        super(props)
        const rootCategory = this.props.match.params.category
        this.state = {
            categoryItemsMap: '',
            categoryPath: '',
            sessionUser: {},
            checkedAuthentication: false,
            rootCategory: rootCategory ? rootCategory : this.ROOT_CATEGORY,
            error: '',
            currentSort: Constants.FEATURED_PROPERTY
        }
    }

    async componentDidMount() {
        requireAuthentication(userInfo => this.setState({ "sessionUser": userInfo, checkedAuthentication: true }))
    }
    cartUpdateCallback(addedQuantity) {
        const newSessionUser = this.state.sessionUser
        newSessionUser.cartCount += addedQuantity
        this.setState({ sessionUser: newSessionUser })
    }
    clearFilters(event) {
        event.preventDefault()
        this.setState({ currentRoot: this.ROOT_CATEGORY })
    }
    sortCallback(sortOption) {
        this.setState({ currentSort: sortOption })
    }
    render() {
        if (this.state.error) {
            return <ErrorPage error={this.state.error} />
        }
        if (!this.state.checkedAuthentication) {
            return <div></div>
        }
        if (!this.state.sessionUser.email) {
            window.location.href = "/"
            return <div></div>
        }

        if (!this.state.categoryItemsMap) {
            getGroceryItems(this.state.rootCategory, (categoryItemsMap) => {
                categoryItemsMap ? this.setState({ categoryItemsMap: categoryItemsMap }) :
                    this.setState({ error: "500 Internal Server Error: Could not retrieve grocery items." })
            })
        }
        if (!this.state.categoryPath) {
            getCategoryPath(this.state.rootCategory, (categoryPath) => {
                categoryPath ? this.setState({ categoryPath: categoryPath })
                    : this.setState({ error: "500 Internal Servor Error: Could not retrieve category path." })
            })
        }
        if (!this.state.categoryItemsMap || !this.state.categoryPath) {
            return <div></div>
        }

        const categories = Object.keys(this.state.categoryItemsMap).sort((category1, category2) => {
            return category1 < category2 ? -1 : 1
        })
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

        let groceryListHTML = ""
        let sortHTML = ""
        if (categories.length === 1) {
            let categoryItems = this.state.categoryItemsMap[categories[0]].slice(0)
            if (this.state.currentSort === Constants.PRICE_ASCENDING_PROPERTY) {
                categoryItems = categoryItems.sort((itemInfo1, itemInfo2) => {
                    return itemInfo1.price > itemInfo2.price ? 1 : -1
                })
            } else if (this.state.currentSort === Constants.PRICE_DESCENDING_PROPERTY) {
                categoryItems = categoryItems.sort((itemInfo1, itemInfo2) => {
                    return itemInfo1.price < itemInfo2.price ? 1 : -1
                })
            }
            groceryListHTML = categoryItems.map((itemInfo) => {
                return <GroceryItem itemInfo={itemInfo} key={itemInfo.name + itemInfo.quantity + itemInfo.quantity_units}
                    sessionUser={this.state.sessionUser} useGridFormat />
            })
            sortHTML = <SortDropdown sortCallback={this.sortCallback.bind(this)} currentSort={this.state.currentSort} />
        } else {
            groceryListHTML = categories.map((category, idx) => {
                let categoryItems = this.state.categoryItemsMap[category]
                return <StoreSection category={category} items={categoryItems} key={category + idx}
                    sessionUser={this.state.sessionUser} cartUpdateCallback={this.cartUpdateCallback.bind(this)} />
            })
        }


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

        const groceryTitleHTML = this.state.categoryPath.map((category, idx) => {
            let rightCaretHTML = idx === this.state.categoryPath.length - 1 ? "" :
                <Octicon className="grocery-title-icon" icon={getIconByName("chevron-right")} />
            let redirectLocation = idx === 0 ? "/store" : `/store/${category}`
            let pathItemHTML = idx === this.state.categoryPath.length - 1 ?
                <p className="category-path-current">{category}</p> :
                <a className="category-path-link" href={redirectLocation}>{category}</a>
            return <React.Fragment key={idx}>
                {pathItemHTML}
                {rightCaretHTML}
            </React.Fragment>
        })
        return (
            <div>
                <Navigation sessionUser={this.state.sessionUser} />
                <div className="grocery-list-outer">
                    {filterHTML}
                    <div className="grocery-list-inner">
                        <div className="grocery-list-header">
                            <div className="grocery-list-title">
                                {groceryTitleHTML}
                            </div>
                            {sortHTML}
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
        cartUpdateCallback: this.props.cartUpdateCallback
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
                rowLength={this.state.items.length} cartUpdateCallback={this.state.cartUpdateCallback} />
        })
        const leftButtonHTML = this.state.index ? <button className="grocery-row-change grocery-row-change-left " onClick={this.previousWindow.bind(this)}>
            <Octicon className="icon-chevron" icon={getIconByName('chevron-left')} />
        </button> : <div className="grocery-row-change-placeholder grocery-row-change-left "></div>
        const rightbuttonHTML = this.state.index + this.MAX_ITEMS < this.state.items.length ?
            <button className="grocery-row-change grocery-row-change-right " onClick={this.nextWindow.bind(this)}>
                <Octicon className="icon-chevron" icon={getIconByName('chevron-right')} />
            </button> : <div className="grocery-row-change-placeholder grocery-row-change-right "></div>

        return <div className="grocery-row-outer">
            <div className="grocery-row-header">
                <p className="grocery-row-category">{this.state.category}</p>
                <a className="grocery-row-see-all" href={`/store/${this.state.category}`}>See more in {this.state.category}</a>
            </div>
            <div className="row grocery-row">
                {leftButtonHTML}
                {itemHTML}
                {rightbuttonHTML}
            </div>
        </div>

    }
}