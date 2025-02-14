import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import { Trans } from "react-i18next";
import AuthContext from "../context/AuthContext";
import { contextType } from "react-quill";
import cogoToast from "cogo-toast";

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
          {/* <div className="search-field d-none d-md-block">
            <form className="d-flex align-items-center h-100" action="#">
              <div className="input-group">
                <div className="input-group-prepend bg-transparent">
                  <i className="input-group-text border-0 mdi mdi-magnify"></i>
                </div>
                <input
                  type="text"
                  className="form-control bg-transparent border-0"
                  placeholder="Search projects"
                />
              </div>
            </form>
          </div> */}
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

                {/* <Dropdown.Menu className="navbar-dropdown">
                  <Dropdown.Item onClick={this.handleSignout}>
                    <i className="mdi mdi-logout me-2 text-primary"></i>
                    <Trans>Signout</Trans>
                  </Dropdown.Item>
                </Dropdown.Menu> */}
              </Dropdown>
            </li>
            {/* <li className="nav-item">
              <Dropdown alignRight>
                <Dropdown.Toggle className="nav-link count-indicator">
                  <i className="mdi mdi-email-outline"></i>
                  <span className="count-symbol bg-warning"></span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="preview-list navbar-dropdown">
                  <h6 className="p-3 mb-0">
                    <Trans>Messages</Trans>
                  </h6>
                  <div className="dropdown-divider"></div>
                  <Dropdown.Item
                    className="dropdown-item preview-item"
                    onClick={(evt) => evt.preventDefault()}
                  >
                    <div className="preview-thumbnail">
                      <img
                        src={require("../../assets/images/faces/female.jpg")}
                        alt="user"
                        className="profile-pic"
                      />
                    </div>
                    <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                      <h6 className="preview-subject ellipsis mb-1 font-weight-normal">
                        <Trans>Mark send you a message</Trans>
                      </h6>
                      <p className="text-gray mb-0">
                        1 <Trans>Minutes ago</Trans>
                      </p>
                    </div>
                  </Dropdown.Item>
                  <div className="dropdown-divider"></div>
                  <Dropdown.Item
                    className="dropdown-item preview-item"
                    onClick={(evt) => evt.preventDefault()}
                  >
                    <div className="preview-thumbnail">
                      <img
                        src={require("../../assets/images/faces/female.jpg")}
                        alt="user"
                        className="profile-pic"
                      />
                    </div>
                    <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                      <h6 className="preview-subject ellipsis mb-1 font-weight-normal">
                        <Trans>Cregh send you a message</Trans>
                      </h6>
                      <p className="text-gray mb-0">
                        15 <Trans>Minutes ago</Trans>
                      </p>
                    </div>
                  </Dropdown.Item>
                  <div className="dropdown-divider"></div>
                  <Dropdown.Item
                    className="dropdown-item preview-item"
                    onClick={(evt) => evt.preventDefault()}
                  >
                    <div className="preview-thumbnail">
                      <img
                        src={require("../../assets/images/faces/female.jpg")}
                        alt="user"
                        className="profile-pic"
                      />
                    </div>
                    <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                      <h6 className="preview-subject ellipsis mb-1 font-weight-normal">
                        <Trans>Profile picture updated</Trans>
                      </h6>
                      <p className="text-gray mb-0">
                        18 <Trans>Minutes ago</Trans>
                      </p>
                    </div>
                  </Dropdown.Item>
                  <div className="dropdown-divider"></div>
                  <h6 className="p-3 mb-0 text-center cursor-pointer">
                    4 <Trans>new messages</Trans>
                  </h6>
                </Dropdown.Menu>
              </Dropdown>
            </li> */}
            {/* <li className="nav-item">
              <Dropdown alignRight>
                <Dropdown.Toggle className="nav-link count-indicator">
                  <i className="mdi mdi-bell-outline"></i>
                  <span className="count-symbol bg-danger"></span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu navbar-dropdown preview-list">
                  <h6 className="p-3 mb-0">
                    <Trans>Notifications</Trans>
                  </h6>
                  <div className="dropdown-divider"></div>
                  <Dropdown.Item
                    className="dropdown-item preview-item"
                    onClick={(evt) => evt.preventDefault()}
                  >
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-success">
                        <i className="mdi mdi-calendar"></i>
                      </div>
                    </div>
                    <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                      <h6 className="preview-subject font-weight-normal mb-1">
                        <Trans>Event today</Trans>
                      </h6>
                      <p className="text-gray ellipsis mb-0">
                        <Trans>
                          Just a reminder that you have an event today
                        </Trans>
                      </p>
                    </div>
                  </Dropdown.Item>
                  <div className="dropdown-divider"></div>
                  <Dropdown.Item
                    className="dropdown-item preview-item"
                    onClick={(evt) => evt.preventDefault()}
                  >
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-warning">
                        <i className="mdi mdi-settings"></i>
                      </div>
                    </div>
                    <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                      <h6 className="preview-subject font-weight-normal mb-1">
                        <Trans>Settings</Trans>
                      </h6>
                      <p className="text-gray ellipsis mb-0">
                        <Trans>Update dashboard</Trans>
                      </p>
                    </div>
                  </Dropdown.Item>
                  <div className="dropdown-divider"></div>
                  <Dropdown.Item
                    className="dropdown-item preview-item"
                    onClick={(evt) => evt.preventDefault()}
                  >
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-info">
                        <i className="mdi mdi-link-variant"></i>
                      </div>
                    </div>
                    <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                      <h6 className="preview-subject font-weight-normal mb-1">
                        <Trans>Launch Admin</Trans>
                      </h6>
                      <p className="text-gray ellipsis mb-0">
                        <Trans>New admin wow</Trans>!
                      </p>
                    </div>
                  </Dropdown.Item>
                  <div className="dropdown-divider"></div>
                  <h6 className="p-3 mb-0 text-center cursor-pointer">
                    <Trans>See all notifications</Trans>
                  </h6>
                </Dropdown.Menu>
              </Dropdown>
            </li>
            <li className="nav-item nav-logout d-none d-lg-block">
              <a
                className="nav-link"
                href="!#"
                onClick={(event) => event.preventDefault()}
              >
                <i className="mdi mdi-power"></i>
              </a>
            </li>
            <li className="nav-item nav-settings d-none d-lg-block">
              <button
                type="button"
                className="nav-link border-0"
                onClick={this.toggleRightSidebar}
              >
                <i className="mdi mdi-format-line-spacing"></i>
              </button>
            </li> */}
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
