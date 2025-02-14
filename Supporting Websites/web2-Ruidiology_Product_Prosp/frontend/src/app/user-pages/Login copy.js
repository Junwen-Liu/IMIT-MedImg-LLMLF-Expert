import React, { Component, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Form } from "react-bootstrap";
import AuthContext from "../context/AuthContext";
import cogoToast from "cogo-toast";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usrname: "",
      pw: "",
    };
  }

  toastoptions = {
    hideAfter: 5,
    position: "top-right",
    // heading: "Attention",
  };

  static contextType = AuthContext;

  loginCheck = () => {
    //check user from data base, log index info in the global state
    let newUser;
    fetch(
      `http://localhost:5000/login?usr=${this.state.usrname}&pw=${this.state.pw}`
    )
      .then((res) => res.json())
      .then((user) => {
        // if (user[0].username === this.state.usrname) {
        newUser = {
          username: user[0].username,
          low_index: user[0].low_index,
          high_index: user[0].high_index,
          sex: user[0].sex,
          position: user[0].position,
        };

        // this.modifyContextUser(newUser);
        const { setUser } = this.context;
        setUser(newUser);

        console.log(
          "this current newly login user is",
          this.context.user.username
        );
        cogoToast.success("登录成功!", this.toastoptions);
        this.props.history.push("/apps/chat");
      });
  };

  render() {
    return (
      <div>
        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="brand-logo">
                  <img
                    src={require("../../assets/images/logo3.png")}
                    style={{ width: 400 }}
                  />
                </div>
                <h4>Hello! let's get started</h4>
                <h6 className="font-weight-light">Sign in to continue.</h6>
                <Form className="pt-3">
                  <Form.Group className="d-flex search-field">
                    <Form.Control
                      type="email"
                      placeholder="Username"
                      size="lg"
                      className="h-auto"
                      onChange={(event) => {
                        this.setState({ usrname: event.target.value });
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="d-flex search-field">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      size="lg"
                      className="h-auto"
                      onChange={(event) => {
                        this.setState({ pw: event.target.value });
                      }}
                    />
                  </Form.Group>
                  <div className="mt-3">
                    <Link
                      className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                      // to="/dashboard"
                      onClick={this.loginCheck}
                    >
                      SIGN IN
                    </Link>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
