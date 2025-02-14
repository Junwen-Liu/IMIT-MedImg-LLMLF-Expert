import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import { Trans } from "react-i18next";
import AuthContext from "../context/AuthContext";
import { contextType } from "react-quill";
import cogoToast from "cogo-toast";
const config = require('../../../package.json').customConfig;

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      low_index: -1,
      high_index: -1,
      sex: "",
      position: "",
    };
  }
  static contextType = AuthContext;

  toastoptions = {
    hideAfter: 5,
    position: "top-right",
    // heading: "Attention",
  };

  handleSignout = () => {
    const defaultUser = {
      username: "",
      low_index: -1,
      high_index: -1,
      sex: "",
      position: "",
    };
    const { history } = this.props;
    console.log("sign out");
    const { setUser } = this.context;
    setUser(defaultUser);
    cogoToast.info("退出成功!", this.toastoptions);
    history.push("/login");
  };

  // retrieveState = () => {
  //   const [usrname, setUsrname] = useGlobalState("username");
  //   console.log("current username is " + usrname);
  //   // const [globalstate, setGlobalState] = useGlobalState();

  //   // const { username, low_index, high_index, sex, position } = globalState;

  //   // // Update component state with global state values
  //   // this.setState({
  //   //   username,
  //   //   low_index,
  //   //   high_index,
  //   //   sex,
  //   //   position,
  //   // });
  // };

  // componentDidMount() {
  //   this.retrieveState();
  // }

  toggleOffcanvas() {
    document.querySelector(".sidebar-offcanvas").classList.toggle("active");
  }
  toggleRightSidebar() {
    document.querySelector(".right-sidebar").classList.toggle("open");
  }
  render() {
    return (
      <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row ">
        <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center bg-dark">
          <Link className="navbar-brand brand-logo" to="/apps/chats">
            <img
              src={require("../../assets/images/logo3.png")}
              style={{ width: 400, objectFit: "cover" }}
              alt="logo"
            />
          </Link>
          <Link className="navbar-brand brand-logo-mini" to="/apps/chats">
            <img
              src={require("../../assets/images/logo-mini.png")}
              alt="logo"
            />
          </Link>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-stretch bg-dark">
          <button
            className="navbar-toggler navbar-toggler align-self-center"
            type="button"
            onClick={() => document.body.classList.toggle("sidebar-icon-only")}
          >
            <span className="mdi mdi-menu"></span>
          </button>
          <div
            className="nav-profile-text d-flex align-items-center justify-content-center"
            style={{ marginRight: 20 }}
          >
            <p className="mb-1 font-weight-bold text-success">
              <span className="font-weight-bold mb-2 text-white" style={{ marginRight: 5 }}>
                <Trans>{"Current Chosen LLM: "}</Trans>
              </span>
              <Trans >   {config.modelPath.split('/')[config.modelPath.split('/').length - 1]}</Trans>
              {/* <Trans > 7b radiologist4</Trans> */}
            </p>
          </div>
          <div
            className="nav-profile-text d-flex align-items-center justify-content-center"
          >
            <p className="mb-1 font-weight-bold text-danger">
              <span className="font-weight-bold mb-2 text-white" style={{ marginRight: 5 }}>
                <Trans>{"Current Web Status: "}</Trans>
              </span>
              <Trans >{config.webStatus}</Trans>
            </p>
          </div>
          <ul className="navbar-nav navbar-nav-right">
            <li className="nav-item nav-profile">
              <Dropdown alignRight>
                <Dropdown.Toggle className="nav-link">
                  <div className="nav-profile-img">
                    <img
                      src={
                        this.context.user.sex == "male"
                          ? require("../../assets/images/faces/male.jpg")
                          : require("../../assets/images/faces/female.jpg")
                      }
                      alt="user"
                    />
                    <span className="availability-status online"></span>
                  </div>
                  <div
                    className="nav-profile-text"
                    onClick={this.handleSignout}
                  >
                    <p className="mb-1 font-weight-bold text-info">
                      <span className="font-weight-bold mb-2 text-white">
                        <Trans>{this.context.user.username + "    "}</Trans>
                      </span>
                      <Trans >SignOut</Trans>
                    </p>
                  </div>
                </Dropdown.Toggle>
              </Dropdown>
            </li>
          </ul>
          <button
            className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
            type="button"
            onClick={this.toggleOffcanvas}
          >
            <span className="mdi mdi-menu"></span>
          </button>
        </div>
      </nav>
    );
  }
}

export default withRouter(Navbar);
