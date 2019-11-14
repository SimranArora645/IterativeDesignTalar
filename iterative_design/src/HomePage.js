import React from 'react';
import HomePageNavigation from './HomePageNavigation.js'
import HomePageRegisterForm from './HomePageRegisterForm.js'
import Octicon, { iconsByName } from '@primer/octicons-react'
import Footer from './Footer.js';

export default class HomePage extends React.Component {
    render() {
        return (
            <div>
                <div className="homepage-banner">
                    <HomePageNavigation />
                    <HomePageRegisterForm />
                </div>
                <div className="homepage-screen1">
                    <div className="screen1-image"></div>
                    <div className="screen1-description">
                        <p className="screen-description-title">Your groceries, on autopilot</p>
                        <p className="screen-description-text">
                            Doing your groceries is as simple as creating an "autopilot" list that runs by itself, and only adding the extras you want each particular week. We make sure we only bring what you need. Nothing more, nothing less.
                        </p>
                        <span className="screen-description-link">
                            Learn more about our grocery-delivery system
                            <Octicon className="octicon-arrow" icon={iconsByName["arrow-right"]} />
                        </span>
                    </div>
                </div>
                <div className="homepage-screen2">
                    <div className="screen2-description">
                        <p className="screen-description-title">Delivered right to your door</p>
                        <p className="screen-description-text">
                            Doing your groceries is as simple as creating an "autopilot" list that runs by itself, and only adding the extras you want each particular week. We make sure we only bring what you need. Nothing more, nothing less.
                        </p>
                        <span className="screen-description-link">
                            Learn more about our grocery-delivery system
                            <Octicon className="octicon-arrow" icon={iconsByName["arrow-right"]} />
                        </span>

                    </div>
                    <div className="screen2-image"></div>
                </div>
                <div className="homepage-screen3 row">
                    <div className="screen3-panel col">
                        <div className="screen3-panel-image" id="screen3-panel-image1">

                        </div>
                        <p className="screen3-panel-title">24/7 Support</p>
                        <p className="screen3-panel-text">Our Support Team provides personal 24/7 support for any issues that occur. We promise to resolve all issues, or your money back.</p>
                    </div>
                    <div className="screen3-panel col">
                        <div className="screen3-panel-image" id="screen3-panel-image2">

                        </div>
                        <p className="screen3-panel-title">Rigorous Training</p>
                        <p className="screen3-panel-text">Our delivery team goes through multiple background checks and intense training specific to their job to ensure the highest level of service.</p>
                    </div>
                    <div className="screen3-panel col">
                        <div className="screen3-panel-image" id="screen3-panel-image3">

                        </div>
                        <p className="screen3-panel-title">Sourced Locally </p>
                        <p className="screen3-panel-text">We care about the community around us. Our ingredients come from local farmers and producers in order to provide you high-quality ingredients at low prices.</p>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

