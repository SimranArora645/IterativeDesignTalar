import React from 'react';

export default class GroceryItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            image: props.itemInfo.image,
            name: props.itemInfo.name,
            description: props.itemInfo.description
        }
    }
    render() {
        const itemStyle = { "background-image": this.state.image, }
        return (
            <div className="grocery-item" style={itemStyle}>
                <div className="grocery-description">
                    <p>{this.state.name}</p>
                    <p>{this.state.description}</p>
                </div>
            </div>
        )
    }
}