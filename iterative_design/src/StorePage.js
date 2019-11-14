import React from 'react';
import './App.css';
import Navigation from './Navigation';
import Footer from './Footer';
import { requireAuthentication, getAllGroceryItems } from './api'
import GroceryItem from './GroceryItem'
import filterTree from './filterTree.json'

export default class StorePage extends React.Component {
    state = {
        groceryItems: [],
        retrievedGroceryItems: false,
        sessionUser: {},
        checkedAuthentication: false,
        currentRoot: filterTree,
    }
    async componentDidMount() {
        requireAuthentication(userInfo => this.setState({ "sessionUser": userInfo, checkedAuthentication: true }))
    }

    changeFilter(event) {
        event.preventDefault()
        const nextFilter = event.target.id
        const children = this.state.currentRoot.children
        const nextRoot = children.find(el => el.label === nextFilter)
        this.setState({ currentRoot: nextRoot })
    }
    checkFilter(filterCategory, root) {
        if (root.label === filterCategory) {
            return true;
        }
        if (root.children === []) {
            return false;
        }
        let recursionResult = false;
        for (let index in root.children) {
            recursionResult = recursionResult || this.checkFilter(filterCategory, root.children[index])
        }
        return recursionResult
    }
    clearFilters(event) {
        event.preventDefault()
        this.setState({ currentRoot: filterTree })
    }
    render() {
        if (!this.state.checkedAuthentication) {
            return <div></div>
        }
        if (!this.state.sessionUser.email) {
            window.location.href = "/"
            return <div></div>
        }

        const groceryCallback = (groceryItems) => {
            this.setState({ retrievedGroceryItems: true, groceryItems: groceryItems })
        }
        if (!this.state.retrievedGroceryItems) {
            getAllGroceryItems(groceryCallback)
        }

        if (!this.state.retrievedGroceryItems) {
            return <div></div>
        }

        let listElementsHTML = this.state.currentRoot.children.map((key, idx) => {
            const label = key.label ? key.label : key
            return <li className="filter-li" key={label} id={label} onClick={this.changeFilter.bind(this)}>{label}</li>
        })
        listElementsHTML.sort((el1, el2) => {
            return el1.key < el2.key ? -1 : 1
        })

        const filterHTML = <div className="grocery-filters">
            <div className="filters-header">
                <p className="filter-title">Filters</p>
                <a className="clear-filters-link" onClick={this.clearFilters.bind(this)}>Clear all</a>
            </div>

            <p className="main-category">{this.state.currentRoot.label}</p>
            <ul className="filter-ul">
                {listElementsHTML}
            </ul>
        </div>

        const currentCategory = this.state.currentRoot.label ? this.state.currentRoot.label : this.state.currentRoot

        const groceryListHTML = this.state.groceryItems.filter((el) => {
            const result = this.checkFilter(el.category, this.state.currentRoot)
            return result
        }).map((item, idx) => {
            return <GroceryItem itemInfo={item} key={item.name} sessionUser={this.state.sessionUser} />
        })

        return (
            <div>
                <Navigation signedIn showSearch />
                <div className="grocery-list-outer">
                    {filterHTML}
                    <div className="grocery-list-inner">
                        <div className="grocery-list-header">
                            <p className="grocery-list-title">{currentCategory}</p>
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
