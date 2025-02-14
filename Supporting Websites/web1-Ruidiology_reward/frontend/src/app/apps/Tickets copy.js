import React, { useEffect, useState, useContext } from "react";
import { Form } from "react-bootstrap";
import { Col, Row, Nav, Tab } from "react-bootstrap";
import { ProgressBar } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import { Dropdown, ButtonGroup } from "react-bootstrap";
import AuthContext from "../context/AuthContext";

function Tickets() {
  const [activeTickets, setActiveTickets] = useState([]);
  const [inactiveTickets, setInactiveTickets] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTicketBestStates, setActiveTicketBestStates] = useState([]);
  const [activeTicketWorstStates, setActiveTicketWorstStates] = useState([]);
  const [inactiveTicketBestStates, setInactiveTicketBestStates] = useState([]);
  const [inactiveTicketWorstStates, setInactiveTicketWorstStates] = useState(
    []
  );
  const context = useContext(AuthContext);

  useEffect(() => {
    console.log("componentDidMount", context.user);
    fetch(
      `http://localhost:5000/descr?low=${context.user.low_index}&high=${context.user.high_index}`
    )
      .then((res) => res.json())
      .then((tickets) => {
        const total_count = tickets.length;
        const active_tickets = tickets.filter(
          (item) => item.status === "active"
        );
        const inactive_tickets = tickets.filter(
          (item) => item.status === "inactive"
        );
        setActiveTickets(active_tickets);
        setInactiveTickets(inactive_tickets);
        setTotalCount(total_count);
      })
      .then(() => {
        setActiveTicketBestStates(
          activeTickets.map((x) => (x.bestAns === 0 ? "请选择" : x.bestAns))
        );
        setActiveTicketWorstStates(
          activeTickets.map((x) => (x.worstAns === 0 ? "请选择" : x.worstAns))
        );
        setInactiveTicketBestStates(
          inactiveTickets.map((x) => (x.bestAns === 0 ? "请选择" : x.bestAns))
        );
        setInactiveTicketWorstStates(
          inactiveTickets.map((x) => (x.worstAns === 0 ? "请选择" : x.worstAns))
        );
      });
  }, []);

  const handleTicketBestStateChange = (index, value) => {
    const updatedStates = [...activeTicketBestStates];
    updatedStates[index] = value;
    setActiveTicketBestStates(updatedStates);
  };

  const handleTicketWorstStateChange = (index, value) => {
    const updatedStates = [...inactiveTicketWorstStates];
    updatedStates[index] = value;
    setActiveTicketWorstStates(updatedStates);
  };

  const handleSubmit = (index) => {
    console.log(
      "this is the current index is ",
      index,
      " of this row, the best value is",
      activeTicketBestStates[index],
      "the worst value is ",
      activeTicketWorstStates[index],
      " the actviate ticket is ",
      activeTickets[index]
    );
    fetch(
      `http://localhost:5000/descr/uptt?idx=${activeTickets[index]}&best=${activeTicketBestStates[index]}&worst=${activeTicketWorstStates[index]}`
    ).then((res) => res.json());
  };

  return (
    <div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="d-sm-flex pb-4 mb-4 border-bottom">
                <div className="d-flex align-items-center">
                  <h5 className="page-title mb-n2">All Review Cases</h5>
                  <p className="mt-2 mb-n1 ms-3 text-muted">
                    {totalCount} Cases
                  </p>
                </div>
              </div>
              <div className="tickets-tab-switch">
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                  <Row>
                    <Col sm={12}>
                      <Nav>
                        <Nav.Item>
                          <Nav.Link
                            eventKey="first"
                            className="d-flex align-items-center"
                          >
                            Open Cases{" "}
                            <div className="badge">{activeTickets.length}</div>
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            eventKey="second"
                            className="d-flex align-items-center"
                          >
                            Completed Cases{" "}
                            <div className="badge">
                              {inactiveTickets.length}
                            </div>
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </Col>
                    <Col sm={12}>
                      <Tab.Content className="w-100 px-0">
                        <Tab.Pane eventKey="first">
                          <div>
                            <div className="tickets-date-group">
                              <i className="mdi mdi-calendar"></i>
                              {Date()}
                            </div>
                            {activeTickets.map((x, index) => {
                              return (
                                <a
                                  key={x.id}
                                  href="!#"
                                  className="tickets-card row mx-0"
                                  onClick={(evt) => evt.preventDefault()}
                                >
                                  <div className="tickets-details col-lg-3 col-3">
                                    <div className="badge badge-gradient-success">
                                      Instruction
                                    </div>
                                    <div className="wrapper">
                                      <h5>{x["instruction"]}</h5>
                                    </div>
                                    <div className="wrapper text-muted d-none d-md-block">
                                      <span>Assigned to</span>
                                      <img
                                        className="assignee-avatar"
                                        src={
                                          context.user.username == "male"
                                            ? require("../../assets/images/faces/male.jpg")
                                            : require("../../assets/images/faces/female.jpg")
                                        }
                                        alt="profile"
                                      />
                                      <span>{context.user.username}</span>
                                      <span>
                                        <i className="mdi mdi-clock-outline"></i>
                                        r_id: {x["idx"]}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="tickets-details col-lg-2 col-1">
                                    <div className="badge badge-gradient-primary">
                                      Ground Truth
                                    </div>

                                    <div className="wrapper">
                                      <Alert variant="primary">
                                        <h5>{x["g_truth"]}</h5>
                                      </Alert>
                                    </div>
                                  </div>
                                  <div className="tickets-details col-lg-2 col-2">
                                    <div className="badge badge-gradient-info">
                                      Response 1
                                    </div>
                                    <div className="wrapper">
                                      <Alert variant="info">
                                        <h5>{x["response1"]}</h5>
                                      </Alert>
                                    </div>
                                  </div>
                                  <div className="tickets-details col-lg-2 col-2">
                                    <div className="badge badge-gradient-info">
                                      Response 2
                                    </div>
                                    <div className="wrapper">
                                      <Alert variant="info">
                                        <h5>{x["response2"]}</h5>
                                      </Alert>
                                    </div>
                                  </div>
                                  <div className="tickets-details col-lg-2 col-2">
                                    <div className="badge badge-gradient-info">
                                      Response 3
                                    </div>
                                    <div className="wrapper">
                                      <Alert variant="info">
                                        <h5>{x["response3"]}</h5>
                                      </Alert>
                                    </div>
                                  </div>
                                  <div className="tickets-details col-lg-1 col-1 ">
                                    <div className="tickets-details col-lg-1 col-1">
                                      <div className="badge badge-gradient-danger">
                                        Reject One
                                      </div>
                                      <div className="wrapper">
                                        <Dropdown>
                                          <Dropdown.Toggle
                                            variant="btn btn-gradient-light"
                                            id="dropdownMenuOutlineButton1"
                                          >
                                            {activeTicketWorstStates[index]}
                                          </Dropdown.Toggle>
                                          <Dropdown.Menu>
                                            <Dropdown.Header>
                                              最差答案
                                            </Dropdown.Header>
                                            <Dropdown.Item
                                              onClick={() =>
                                                handleTicketWorstStateChange(
                                                  index,
                                                  "GT"
                                                )
                                              }
                                            >
                                              GT
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              onClick={() =>
                                                handleTicketWorstStateChange(
                                                  index,
                                                  "1"
                                                )
                                              }
                                            >
                                              1
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              onClick={() =>
                                                handleTicketWorstStateChange(
                                                  index,
                                                  "2"
                                                )
                                              }
                                            >
                                              2
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              onClick={() =>
                                                handleTicketWorstStateChange(
                                                  index,
                                                  "3"
                                                )
                                              }
                                            >
                                              3
                                            </Dropdown.Item>
                                          </Dropdown.Menu>
                                        </Dropdown>
                                      </div>
                                      <div className="badge badge-gradient-primary">
                                        Accept One
                                      </div>
                                      <div className="wrapper">
                                        <Dropdown>
                                          <Dropdown.Toggle
                                            variant="btn btn-gradient-light"
                                            id="dropdownMenuOutlineButton1"
                                          >
                                            {activeTicketBestStates[index]}
                                          </Dropdown.Toggle>
                                          <Dropdown.Menu>
                                            <Dropdown.Header>
                                              最佳答案
                                            </Dropdown.Header>
                                            <Dropdown.Item
                                              onClick={() =>
                                                handleTicketBestStateChange(
                                                  index,
                                                  "GT"
                                                )
                                              }
                                            >
                                              GT
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              onClick={() =>
                                                handleTicketBestStateChange(
                                                  index,
                                                  "1"
                                                )
                                              }
                                            >
                                              1
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              onClick={() =>
                                                handleTicketBestStateChange(
                                                  index,
                                                  "2"
                                                )
                                              }
                                            >
                                              2
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              onClick={() =>
                                                handleTicketBestStateChange(
                                                  index,
                                                  "3"
                                                )
                                              }
                                            >
                                              3
                                            </Dropdown.Item>
                                          </Dropdown.Menu>
                                        </Dropdown>
                                      </div>
                                      <button
                                        type="button"
                                        className="btn btn-gradient-success"
                                        style={{
                                          width: "127px",
                                        }}
                                        onClick={() => handleSubmit(index)}
                                      >
                                        Submit
                                      </button>
                                    </div>
                                  </div>
                                </a>
                              );
                            })}
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="second">
                          <div>
                            <div className="tickets-date-group">
                              <i className="mdi mdi-calendar"></i>
                              {Date()}
                            </div>
                            {inactiveTickets.map((x) => {
                              return (
                                <a
                                  href="!#"
                                  className="tickets-card row mx-0"
                                  onClick={(evt) => evt.preventDefault()}
                                >
                                  <div className="tickets-details col-lg-3 col-3">
                                    <div className="badge badge-gradient-success">
                                      Instruction
                                    </div>
                                    <div className="wrapper">
                                      <h5>{x["instruction"]}</h5>
                                    </div>
                                    <div className="wrapper text-muted d-none d-md-block">
                                      <span>Assigned to</span>
                                      <img
                                        className="assignee-avatar"
                                        src={
                                          context.user.username == "male"
                                            ? require("../../assets/images/faces/male.jpg")
                                            : require("../../assets/images/faces/female.jpg")
                                        }
                                        alt="profile"
                                      />
                                      <span>{context.user.username}</span>
                                      <span>
                                        <i className="mdi mdi-clock-outline"></i>
                                        r_id: {x["idx"]}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="tickets-details col-lg-2 col-1">
                                    <div className="badge badge-gradient-primary">
                                      Ground Truth
                                    </div>

                                    <div className="wrapper">
                                      <Alert variant="primary">
                                        <h5>{x["g_truth"]}</h5>
                                      </Alert>
                                    </div>
                                  </div>
                                  <div className="tickets-details col-lg-2 col-2">
                                    <div className="badge badge-gradient-info">
                                      Response 1
                                    </div>
                                    <div className="wrapper">
                                      <Alert variant="info">
                                        <h5>{x["response1"]}</h5>
                                      </Alert>
                                    </div>
                                  </div>
                                  <div className="tickets-details col-lg-2 col-2">
                                    <div className="badge badge-gradient-info">
                                      Response 2
                                    </div>
                                    <div className="wrapper">
                                      <Alert variant="info">
                                        <h5>{x["response2"]}</h5>
                                      </Alert>
                                    </div>
                                  </div>
                                  <div className="tickets-details col-lg-2 col-2">
                                    <div className="badge badge-gradient-info">
                                      Response 3
                                    </div>
                                    <div className="wrapper">
                                      <Alert variant="info">
                                        <h5>{x["response3"]}</h5>
                                      </Alert>
                                    </div>
                                  </div>
                                  <div className="tickets-details col-lg-1 col-1 ">
                                    <div className="tickets-details col-lg-1 col-1">
                                      <div className="badge badge-gradient-danger">
                                        Reject One
                                      </div>
                                      <div className="wrapper">
                                        <Dropdown>
                                          <Dropdown.Toggle
                                            variant="btn btn-gradient-light"
                                            id="dropdownMenuOutlineButton1"
                                          >
                                            {x.state}
                                          </Dropdown.Toggle>
                                          <Dropdown.Menu>
                                            <Dropdown.Header>
                                              最差答案
                                            </Dropdown.Header>
                                            <Dropdown.Item onClick={() => {}}>
                                              GT
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => {}}>
                                              1
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => {}}>
                                              2
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => {}}>
                                              3
                                            </Dropdown.Item>
                                          </Dropdown.Menu>
                                        </Dropdown>
                                      </div>
                                      <div className="badge badge-gradient-primary">
                                        Accept One
                                      </div>
                                      <div className="wrapper">
                                        <Dropdown>
                                          <Dropdown.Toggle
                                            variant="btn btn-gradient-light"
                                            id="dropdownMenuOutlineButton1"
                                          >
                                            {}
                                          </Dropdown.Toggle>
                                          <Dropdown.Menu>
                                            <Dropdown.Header>
                                              最佳答案
                                            </Dropdown.Header>
                                            <Dropdown.Item onClick={() => {}}>
                                              GT
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => {}}>
                                              1
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => {}}>
                                              2
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => {}}>
                                              3
                                            </Dropdown.Item>
                                          </Dropdown.Menu>
                                        </Dropdown>
                                      </div>
                                      <button
                                        type="button"
                                        className="btn btn-gradient-success"
                                        style={{
                                          width: "127px",
                                        }}
                                      >
                                        Submit
                                      </button>
                                    </div>
                                  </div>
                                </a>
                              );
                            })}
                            {/* <a
                                href="!#"
                                className="tickets-card row mx-0"
                                onClick={(evt) => evt.preventDefault()}
                              >
                                <div className="tickets-details col-lg-7">
                                  <div className="wrapper">
                                    <h5>#39045 - Design Admin Dashboard</h5>
                                  </div>
                                  <div className="wrapper text-muted d-none d-md-block">
                                    <span>Assigned to</span>
                                    <img
                                      className="assignee-avatar"
                                      src={require("../../assets/images/faces/female.jpg")}
                                      alt="profile"
                                    />
                                    <span>Luella Sparks</span>
                                    <span>
                                      <i className="mdi mdi-clock-outline"></i>
                                      12:54PM
                                    </span>
                                  </div>
                                </div>
                                <div className="ticket-float col-lg-3 col-sm-6 pr-0">
                                  <img
                                    className="img-xs rounded-circle"
                                    src={require("../../assets/images/faces/female.jpg")}
                                    alt="profile"
                                  />
                                  <span className="text-muted">
                                    Hunter Garza
                                  </span>
                                </div>
                                <div className="ticket-float col-lg-2 col-sm-6">
                                  <i className="category-icon mdi mdi-folder-outline"></i>
                                  <span className="text-muted">Concept</span>
                                </div>
                              </a> */}
                          </div>
                        </Tab.Pane>
                      </Tab.Content>
                    </Col>
                  </Row>
                </Tab.Container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tickets;
