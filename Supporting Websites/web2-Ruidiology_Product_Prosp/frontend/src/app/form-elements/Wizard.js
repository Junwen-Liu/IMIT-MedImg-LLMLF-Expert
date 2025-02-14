import React, { Component } from 'react';
// import MultiStep from 'react-multistep';
// const MultiStep = import from ('react-multistep');
import MultiStep from 'react-multistep';


export class Wizard extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <div className="form-wizard">
                  <MultiStep showNavigation={true} className="my-class" steps={steps}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export class Account extends Component {
  render() {
    return (
      <section className="content">
        <h3 className="mb-4">Account</h3>
        <div className="form-group">
          <label>Email address</label>
          <input type="email" className="form-control" aria-describedby="emailHelp" placeholder="Enter email"/>
          <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="form-control" placeholder="Password"/>
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" className="form-control" placeholder="Confirm password"/>
        </div>
      </section>
    )
  }
}

export class Profile extends Component {
  render() {
    return (
      <section className="content">
        <h3 className="mb-4">Profile</h3>
        <div className="form-group">
          <label>First name</label>
          <input type="email" className="form-control" aria-describedby="emailHelp" placeholder="Enter first name"/>
        </div>
        <div className="form-group">
          <label>Last name</label>
          <input type="password" className="form-control" placeholder="Last name"/>
        </div>
        <div className="form-group">
          <label>Profession</label>
          <input type="password" className="form-control" placeholder="Profession"/>
        </div>
      </section>
    )
  }
}

export class Comments extends Component {
  render() {
    return (
      <section className="content">
        <h3 className="mb-4">Comments</h3>
        <div className="form-group">
          <label>Comments</label>
          <textarea className="form-control" rows="3"></textarea>
        </div>
      </section>
    )
  }
}

export class Finish extends Component {
  render() {
    return (
      <section className="content">
        <h3 className="mb-4">Finish</h3>
        <div className="form-check">
          <label className="form-check-label">
            <input className="checkbox" type="checkbox"/>
            <i className="input-helper"></i>
            I agree with the Terms and Conditions.
          </label>
        </div>
      </section>
    )
  } 
}

const steps = [
  {name: '. Account', component: <Account/>},
  {name: '. Profile', component: <Profile/>},
  {name: '. Comments', component: <Comments/>},
  {name: '. Finish', component: <Finish/>}
];

export default Wizard
