import React from 'react';
import './App.css';
import Navigation from './Navigation';
import Footer from './Footer';
import { requireAuthentication, getPlans } from './api'
import Octicon, { Check } from '@primer/octicons-react'

export default class PricingPage extends React.Component {
    state = {
        "pricingPlans": [],
        "retrievedPlans": false,
        "sessionUser": {},
        "checkedAuthentication": false,
    }
    isSignedIn() {
        return !!this.state.sessionUser.email;
    }
    async componentDidMount() {
        requireAuthentication(userInfo => this.setState({ "sessionUser": userInfo, checkedAuthentication: true }), false)
    }
    async setPlanHandler(event) {
        if (!this.isSignedIn()) {
            window.location.href = '/register'
        }
        const planName = event.target.name

        const postParams = { planName: planName, userEmail: this.state.sessionUser.email }
        await fetch("/api/set-plan", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postParams)
        }).then(async (res) => {
            const responseBody = await res.json()
            if (responseBody.error) {
                //Should never happen.
                console.log(responseBody.error)
                alert('500 Internal Server Error')
            } else {
                const newSessionInfo = this.state.sessionUser
                newSessionInfo.chosenPlan.name = planName
                this.setState({ sessionUser: newSessionInfo, checkedAuthentication: true })
                //window.location.href = "/grocery-list"
            }
        })
    }
    render() {
        const plansCallback = (pricingPlans) => {
            this.setState({ "retrievedPlans": true, "pricingPlans": pricingPlans })
        }
        if (!this.state.retrievedPlans) {
            getPlans(plansCallback)
        }
        let key = "";
        let tableHTML = ""
        if (this.state.retrievedPlans && this.state.checkedAuthentication) {
            let buttonText = this.isSignedIn() ? 'Pick Your Plan' : 'Get Started'
            let planHeader = this.state.pricingPlans.map((plan) => {
                let buttonHTML = <button className="btn choose-plan-button" name={plan.name}
                    onClick={this.setPlanHandler.bind(this)}>{buttonText}</button>
                if (this.isSignedIn() && plan.name === this.state.sessionUser.chosenPlan.name) {
                    buttonHTML = <button className="btn chosen-plan-button" name={plan.name}
                        onClick={this.setPlanHandler.bind(this)}>Your Plan</button>
                }
                return <td key={plan.name + "-header"} className="table-column-header">
                    <p className='table-column-title'>{plan.name}</p>
                    <p className="plan-pricing-value">${plan.pricing}/month</p>
                    {buttonHTML}
                </td>
            })

            const fieldToText = {
                'frequency': 'Delivery frequency',
                'support_availability': '24/7 online support',
                'free_delivery': 'Free delivery',
                'no_hidden_tips': 'No hidden tips',
                'online_reports': 'Online reports',
                'advanced_reports': 'Professional reports',
                'reduced_waste': 'Reduced Environmental Waste',
                'encryption': 'AES-256 and SSL encryption',
                'tracking': 'Online Order Tracking',
                'morning_delivery': 'Morning Delivery'
            }
            let planFields = {
                'FEATURES': ['frequency', 'free_delivery', 'reduced_waste', 'encryption', 'tracking', 'no_hidden_tips', 'morning_delivery'],
                'REPORTING': ['online_reports', 'advanced_reports', 'support_availability']
            }
            let alwaysFields = ['reduced_waste', 'no_hidden_tips', 'free_delivery', 'encryption', 'tracking', 'morning_delivery']
            let cellValue = ''
            let planRows = []
            Object.keys(planFields).forEach((category) => {
                planRows.push(<tr key={category}><td className='table-category' colSpan="4">{category}</td></tr>)
                planFields[category].forEach((field) => {
                    let planRowItems = this.state.pricingPlans.map((plan) => {
                        cellValue = plan[field]
                        if (plan[field] === 'True') {
                            cellValue = <Octicon icon={Check} className="table-check-icon" />
                        } else if (plan[field] === 'False') {
                            cellValue = '-'
                        } else if (alwaysFields.includes(field)) {
                            cellValue = <Octicon icon={Check} className="table-check-icon" />
                        }
                        return <td className="table-row-value" key={plan.name + field}>{cellValue}</td>
                    })
                    key = "row" + key
                    planRows.push(<tr className="" key={field}>
                        <th><p className="table-row-name">{fieldToText[field]}</p></th>
                        {planRowItems}
                    </tr>)
                })
            })
            tableHTML = (<table className="table table-bordered pricing-table ">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        {planHeader}
                    </tr>
                </thead>

                <tbody>
                    {planRows}
                </tbody>

            </table>)
        } else {
            return <div>

            </div>
        }

        return (
            <React.Fragment>
                <Navigation signedIn={!!this.state.sessionUser.email} />
                <div className="plans-outer">
                    <p className="plans-title">Choose the right plan for you</p>
                    {tableHTML}
                </div>
                <Footer />
            </React.Fragment>
        )
    }
}