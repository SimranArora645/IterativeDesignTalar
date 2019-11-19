import React from 'react';
import './App.css';
import Navigation from './Navigation.js'
import Footer from './Footer.js';
import { requireAuthentication } from './api'

export default class HelpPage extends React.Component {
  state = {
      "sessionUser": {},
      "checkedAuthentication": false,
  }
  async componentDidMount() {
      requireAuthentication(userInfo => this.setState({ "sessionUser": userInfo, checkedAuthentication: true }), false)
  }
    render() {
      if (!this.state.checkedAuthentication) {
          return <div></div>
      }
        return (
            <React.Fragment>
            <Navigation signedIn={!!this.state.sessionUser.email} showSearch />
            <div className="help-FAQs">
              <strong>
              What is the stocking schedule and how am I notified?
              </strong>
              <br/>
              <div className="help-FAQs-answers">
              <p>
              9am-6pm, Monday-Friday
              </p>
              </div>
              <strong>
              What stores can I shop groceries at?
              </strong>
              <br/>
              <p>
              <div className="help-FAQs-answers">
              With Talar, you can shop at
              <a href="https://www.wholefoodsmarket.com/"> WholeFoods </a>,
              <a href="https://www.costco.com/"> Costco</a>,
              <a href="https://www.safeway.com/home.html"> Safeway</a>,
              <a href="https://biritemarket.com/"> Bi-Rite Market</a>, and
              <a href="https://www.traderjoes.com/"> Trader Joe's</a>
              </div>
              </p>
              <p>
              <strong>
              How do you ensure safety with stocking when I'm not at home?
              </strong>
              <br/>
              <div className="help-FAQs-answers">
              We run serious background checks using <a href="https://checkr.com/"> Checkr </a> and picking their most comprehensive
              screening option. The background check looks at the following:
              </div>
              <div className="help-FAQs-bullet">
              <li> SSN Trace </li>
              <li> Global Watchlist Search </li>
              <li> National Search </li>
              <li> SSN Trace </li>
              <li> County Search </li>
              </div>
              <div className="help-FAQs-answers">
              This is further followed by a vetting process that includes in-depth discussions with references listed by the candiates,
              behavioral matching questions and fit questions to make sure that the candidate meets the dafety standards that Talar
              gaurantees. Moreover, if a customer does not feel happy with their assigned care team, they can request to be matched
              with a different care team that they might feel more comfortable with.
              </div>
              </p>
              <p>
              <strong>
              Can I get a free trial to see if Talar meets my needs?
              </strong>
              <div className="help-FAQs-answers">
              Absolutely! You just have to share Jupiter with 5 friends and you can get a free one month trial
              </div>
              </p>
              <p>
              <strong>
              How does onboarding work?
              </strong>
              <br/>
              <div className="help-FAQs-answers">
              Usually onboarding takes place in-person and lasts 30 minutes. There are 4 major steps involved in the process:
              <div className="help-FAQs-bullet">
              <li> The care team familiarizes themselves with your space </li>
              <li> They take detailed notes of your stocking areas and where different prodcuts should go </li>
              <li> They learn about your preferences and priorities </li>
              <li> The care team goes over the procedure of how to access your space going forward </li>
              </div>
              </div>
              </p>
              <p>
              <strong>
              What are the different pricing plans available?
              </strong>
              <br/>
              <div className="help-FAQs-answers">
              We offer three different pricing plans for a single person, for couple and for families. You can find a comprehensive listed
              <a href ="http://csci1300iterativedesign.herokuapp.com/pricing"> here </a>
              </div>
              </p>
              <p>
              <strong>
              How can I sign up or log in?
              </strong>
              <br/>
              We try to make your experience as convenient and time efficient as possible. You can easily <strong> register </strong> as a first time user with your
              address and postal code
              <a href="http://csci1300iterativedesign.herokuapp.com/register"> here </a>
              or <strong> log in </strong> as an existing user with your email address and password
              <a href="http://csci1300iterativedesign.herokuapp.com/login"> here </a>
              </p>
            </div >
            <Footer />
            </React.Fragment>
        )
    }
}
