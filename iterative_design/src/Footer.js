import React from 'react';

export default class Footer extends React.Component {
    render() {
        const footerItemsMap = {
            "Support": { "Privacy Policy": "/privacy-policy", "Help": "/help", "Contact Us": "/contact-us" },
            "Information": { "Grocery Options": "/grocery-options", "Sourcing": "/sourcing" },
            "Pricing": { "Price Plans": "/pricing", "Plan registration": "/register" },
        }
        const footerItemsHTML = Object.keys(footerItemsMap).map((itemTitle, idx) => {
            let footerLinksMap = footerItemsMap[itemTitle]
            let itemLinks = Object.keys(footerLinksMap).map((linkLabel, idx2) => {
                return (
                    <a className="footer-item-link footer-text" key={idx2} href={footerLinksMap[linkLabel]}>{linkLabel}</a>
                )
            })
            return (
                <div className="footer-item" key={idx}>
                    <p className="footer-item-title footer-text">
                        {itemTitle}
                    </p>
                    {itemLinks}
                </div>
            )
        })
        return (
            <div className="footer-outer">
                <div className="footer-address">
                    <p className="footer-address-title footer-text">
                        Talar, Inc.
                    </p>
                    <p className="footer-address-text footer-text">
                        60 29th Street, Suite 1007
                        <br />
                        San Francisco, CA 94110
                    </p>
                </div>
                <div className="footer-items">
                    {footerItemsHTML}
                </div>

            </div>
        )
    }
}

