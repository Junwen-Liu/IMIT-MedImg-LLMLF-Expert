import React, { useEffect, useState, useContext } from "react";
import { Form } from "react-bootstrap";
import { Col, Row, Nav, Tab } from "react-bootstrap";
import { ProgressBar } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import { Dropdown, ButtonGroup } from "react-bootstrap";
import AuthContext from "../context/AuthContext";
import RadioButtonGroup from "./RadioButtonGroup";

function Tickets() {
  const [activeTickets, setActiveTickets] = useState([]);
  const [inactiveTickets, setInactiveTickets] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTicketBestStates, setActiveTicketBestStates] = useState([]);
  const [activeTicketWorstStates, setActiveTicketWorstStates] = useState([]);
  const context = useContext(AuthContext);


  useEffect(() => {
    console.log("componentDidMount", context.user);
    fetch(
      `http://localhost:5001/descr?low=${context.user.low_index}&high=${context.user.high_index}`
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

        return {
          activeTickets: active_tickets,
          inactiveTickets: inactive_tickets,
        };
      })
      .then(({ activeTickets }) => {
        setActiveTicketBestStates(
          activeTickets.map((x) => (x.bestAns == 0 ? "请选择" : x.bestAns))
        );
        setActiveTicketWorstStates(
          activeTickets.map((x) => (x.worstAns == 0 ? "请选择" : x.worstAns))
        );
      });
  }, []);

  const handleTicketBestStateChange = (index, value) => {
    const updatedStates = [...activeTicketBestStates];
    updatedStates[index] = value;
    setActiveTicketBestStates(updatedStates);
  };

  const handleTicketWorstStateChange = (index, value) => {
    const updatedStates = [...activeTicketWorstStates];
    updatedStates[index] = value;
    setActiveTicketWorstStates(updatedStates);
  };

  const handleSubmit = (index) => {
    // console.log(
    //   "this is the current index is ",
    //   index,
    //   " of this row, the best value is",
    //   activeTicketBestStates[index],
    //   "the worst value is ",
    //   activeTicketWorstStates[index],
    //   " the actviate ticket is ",
    //   activeTickets[index]
    // );
    fetch(
      `http://localhost:5001/descr/updtt?idx=${activeTickets[index].idx}&best=${activeTicketBestStates[index]}&worst=${activeTicketWorstStates[index]}`,
      { method: "PUT" }
    ).then((res) => res.json());

    const targetTicket = activeTickets[index];
    const targetBestState = activeTicketBestStates[index];
    const targetWorstState = activeTicketWorstStates[index];
    const upt_targetTicket = {
      ...targetTicket,
      bestAns: targetBestState,
      worstAns: targetWorstState,
    };
    const updatedActiveTickets = activeTickets.filter(
      (ticket) => ticket.idx !== targetTicket.idx
    );

    const updatedActiveTicketBestStates = activeTicketBestStates.filter(
      (_, index) => index !== index
    );

    const updatedActiveTicketWorstStates = activeTicketWorstStates.filter(
      (_, index) => index !== index
    );

    // Update the state with the updatedActiveTickets array
    setActiveTicketBestStates(updatedActiveTicketBestStates);
    setActiveTicketWorstStates(updatedActiveTicketWorstStates);
    setActiveTickets(updatedActiveTickets);

    setInactiveTickets([...inactiveTickets, upt_targetTicket]);
  };

  const handleRevoke = (index) => {
    fetch(
      `http://localhost:5001/descr/activate?idx=${inactiveTickets[index].idx}`,
      { method: "PUT" }
    ).then((res) => res.json());

    const targetTicket = inactiveTickets[index];
    const targetBestState = inactiveTickets[index].bestAns;
    const targetWorstState = inactiveTickets[index].worstAns;

    const updatedInactiveTickets = inactiveTickets.filter(
      (ticket) => ticket.idx !== targetTicket.idx
    );



    setInactiveTickets(updatedInactiveTickets);
    setActiveTicketBestStates([...activeTicketBestStates, targetBestState]);
    setActiveTicketWorstStates([...activeTicketWorstStates, targetWorstState]);
    setActiveTickets([...activeTickets, targetTicket]);
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
                                  <div className="tickets-card column mx-0">
                                    <div className="col-12">
                                      <div className="row mx-0 col-lg-12 col-12">
                                        <div className="tickets-details col-lg-5 col-5 ">
                                          <div className="badge badge-gradient-success ">
                                            Instruction_idx_{x.idx}
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
                                        <div className="tickets-details col-lg-4 col-4">
                                          <div className="badge badge-gradient-primary">
                                            Grading Criteria
                                          </div>

                                          <div className="wrapper">
                                            <Alert variant="primary">
                                              <h5>{x["g_truth"]}</h5>
                                            </Alert>
                                          </div>
                                        </div>

                                        {/* <div className="tickets-details col-lg-1 col-1">
                                        <div className="badge badge-gradient-info"></div>
                                        <div className="wrapper"></div>
                                      </div> */}
                                        {/* <div className="tickets-details col-lg-1 col-1">
                                        <div className="badge badge-gradient-info"></div>
                                        <div className="wrapper"></div>
                                      </div>
                                      <div className="tickets-details col-lg-1 col-1">
                                        <div className="badge badge-gradient-info"></div>
                                        <div className="wrapper"></div>
                                      </div> */}
                                        <div className="tickets-details col-lg-3 col-3">
                                          <div className="badge badge-gradient-info"></div>
                                          <div className="tickets-details col-lg-3 col-3">
                                            <div className="badge badge-gradient-danger">
                                              选择一个最差答案
                                            </div>
                                            <div className="wrapper">
                                              <Dropdown>
                                                <Dropdown.Toggle
                                                  variant="btn btn-gradient-light"
                                                  id="dropdownMenuOutlineButton1"
                                                >
                                                  {activeTicketWorstStates[
                                                    index
                                                  ]
                                                    ? activeTicketWorstStates[
                                                    index
                                                    ]
                                                    : "请选择"}
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

                                                  <Dropdown.Item
                                                    onClick={() =>
                                                      handleTicketWorstStateChange(
                                                        index,
                                                        "4"
                                                      )
                                                    }
                                                  >
                                                    4
                                                  </Dropdown.Item>
                                                </Dropdown.Menu>
                                              </Dropdown>
                                            </div>
                                            <div className="badge badge-gradient-primary">
                                              选择一个最优答案
                                            </div>
                                            <div className="wrapper">
                                              <Dropdown>
                                                <Dropdown.Toggle
                                                  variant="btn btn-gradient-light"
                                                  id="dropdownMenuOutlineButton1"
                                                >
                                                  {activeTicketBestStates[index]
                                                    ? activeTicketBestStates[
                                                    index
                                                    ]
                                                    : "请选择"}
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

                                                  <Dropdown.Item
                                                    onClick={() =>
                                                      handleTicketBestStateChange(
                                                        index,
                                                        "4"
                                                      )
                                                    }
                                                  >
                                                    4
                                                  </Dropdown.Item>
                                                </Dropdown.Menu>
                                              </Dropdown>
                                            </div>
                                            <div className="badge badge-gradient-danger">
                                              选择一个最差答案
                                            </div>
                                            <div className="wrapper">
                                              <Dropdown>
                                                <Dropdown.Toggle
                                                  variant="btn btn-gradient-light"
                                                  id="dropdownMenuOutlineButton1"
                                                >
                                                  {activeTicketWorstStates[
                                                    index
                                                  ]
                                                    ? activeTicketWorstStates[
                                                    index
                                                    ]
                                                    : "请选择"}
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

                                                  <Dropdown.Item
                                                    onClick={() =>
                                                      handleTicketWorstStateChange(
                                                        index,
                                                        "4"
                                                      )
                                                    }
                                                  >
                                                    4
                                                  </Dropdown.Item>
                                                </Dropdown.Menu>
                                              </Dropdown>
                                            </div>
                                            <button
                                              type="button"
                                              className="btn btn-gradient-success"
                                              style={{
                                                width: "150px",
                                              }}
                                              onClick={() =>
                                                handleSubmit(index)
                                              }
                                            >
                                              Submit
                                            </button>
                                          </div>
                                          <div className="wrapper"></div>
                                        </div>

                                        <div className="d-flex justify-content-between">
                                          <div className="tickets-details col-lg-2 col-2 p-2 flex-fill">
                                            <div className="badge badge-gradient-info">
                                              Response 1
                                            </div>
                                            <div className="wrapper">
                                              <Alert variant="info">
                                                <h5>{x["response1"]}</h5>
                                              </Alert>
                                            </div>
                                            <RadioButtonGroup
                                              name="C_value"
                                              value={"1"}
                                              onChange={console.log('test')}
                                            />
                                          </div>
                                          <div className="tickets-details col-lg-2 col-2 p-2 flex-fill">
                                            <div className="badge badge-gradient-info">
                                              Response 2
                                            </div>
                                            <div className="wrapper">
                                              <Alert variant="info">
                                                <h5>{x["response2"]}</h5>
                                              </Alert>
                                            </div>
                                          </div>
                                          <div className="tickets-details col-lg-2 col-2 p-2 flex-fill">
                                            <div className="badge badge-gradient-info">
                                              Response 3
                                            </div>
                                            <div className="wrapper">
                                              <Alert variant="info">
                                                <h5>{x["response3"]}</h5>
                                              </Alert>
                                            </div>
                                          </div>
                                          <div className="tickets-details col-lg-2 col-2 p-2 flex-fill">
                                            <div className="badge badge-gradient-info">
                                              Response 4
                                            </div>
                                            <div className="wrapper">
                                              <Alert variant="info">
                                                <h5>{x["response4"]}</h5>
                                              </Alert>
                                            </div>
                                          </div>

                                          <div className="tickets-details col-lg-2 col-2 p-2 flex-fill">
                                            <div className="badge badge-gradient-info">
                                              Response 5
                                            </div>
                                            <div className="wrapper">
                                              <Alert variant="info">
                                                <h5>{x["response1"]}</h5>
                                              </Alert>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                          <div className="tickets-details col-lg-2 col-2 p-2 flex-fill">
                                            <div className="badge badge-gradient-info">
                                              Response 6
                                            </div>
                                            <div className="wrapper">
                                              <Alert variant="info">
                                                <h5>{x["response1"]}</h5>
                                              </Alert>
                                            </div>
                                          </div>
                                          <div className="tickets-details col-lg-2 col-2 p-2 flex-fill">
                                            <div className="badge badge-gradient-info">
                                              Response 7
                                            </div>
                                            <div className="wrapper">
                                              <Alert variant="info">
                                                <h5>{x["response1"]}</h5>
                                              </Alert>
                                            </div>
                                          </div>
                                          <div className="tickets-details col-lg-2 col-2 p-2 flex-fill">
                                            <div className="badge badge-gradient-info">
                                              Response 8
                                            </div>
                                            <div className="wrapper">
                                              <Alert variant="info">
                                                <h5>{x["response1"]}</h5>
                                              </Alert>
                                            </div>
                                          </div>
                                          <div className="tickets-details col-lg-2 col-2 p-2 flex-fill">
                                            <div className="badge badge-gradient-info">
                                              Response 9
                                            </div>
                                            <div className="wrapper">
                                              <Alert variant="info">
                                                <h5>{x["response1"]}</h5>
                                              </Alert>
                                            </div>
                                          </div>
                                          <div className="tickets-details col-lg-2 col-2 p-2 flex-fill">
                                            <div className="badge badge-gradient-info">
                                              Response 10
                                            </div>
                                            <div className="wrapper">
                                              <Alert variant="info">
                                                <h5>{x["response1"]}</h5>
                                              </Alert>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className=" row mx-1 col-lg-2 col-2">
                                        <div className="tickets-details col-lg-1 col-1 "></div>
                                      </div>
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
                            {inactiveTickets.map((x, index) => {
                              return (
                                <a
                                  key={x.idx}
                                  href="!#"
                                  className="tickets-card row mx-0"
                                  onClick={(evt) => evt.preventDefault()}
                                >
                                  <div className="tickets-card column mx-0">
                                    <div className=" row mx-0 col-lg-10 col-10">
                                      <div className="tickets-details col-lg-5 col-5">
                                        <div className="badge badge-gradient-success">
                                          Instruction_idx_{x.idx}
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
                                      <div className="tickets-details col-lg-3 col-3">
                                        <div className="badge badge-gradient-primary">
                                          Grading Criteria
                                        </div>

                                        <div className="wrapper">
                                          <Alert variant="primary">
                                            <h5>{x["g_truth"]}</h5>
                                          </Alert>
                                        </div>
                                      </div>
                                      <div className="tickets-details col-lg-1 col-1">
                                        <div className="badge badge-gradient-info"></div>
                                        <div className="wrapper"></div>
                                      </div>
                                      <div className="tickets-details col-lg-1 col-1">
                                        <div className="badge badge-gradient-info"></div>
                                        <div className="wrapper"></div>
                                      </div>
                                      <div className="tickets-details col-lg-1 col-1">
                                        <div className="badge badge-gradient-info"></div>
                                        <div className="wrapper"></div>
                                      </div>

                                      <div className="tickets-details col-lg-3 col-3">
                                        <div className="badge badge-gradient-info">
                                          Response 1
                                        </div>
                                        <div className="wrapper">
                                          <Alert variant="info">
                                            <h5>{x["response1"]}</h5>
                                          </Alert>
                                        </div>
                                      </div>
                                      <div className="tickets-details col-lg-3 col-3">
                                        <div className="badge badge-gradient-info">
                                          Response 2
                                        </div>
                                        <div className="wrapper">
                                          <Alert variant="info">
                                            <h5>{x["response2"]}</h5>
                                          </Alert>
                                        </div>
                                      </div>
                                      <div className="tickets-details col-lg-3 col-3">
                                        <div className="badge badge-gradient-info">
                                          Response 3
                                        </div>
                                        <div className="wrapper">
                                          <Alert variant="info">
                                            <h5>{x["response3"]}</h5>
                                          </Alert>
                                        </div>
                                      </div>
                                      <div className="tickets-details col-lg-3 col-3">
                                        <div className="badge badge-gradient-info">
                                          Response 4
                                        </div>
                                        <div className="wrapper">
                                          <Alert variant="info">
                                            <h5>{x["response4"]}</h5>
                                          </Alert>
                                        </div>
                                      </div>
                                      <div className="tickets-details col-lg-3 col-3">
                                        <div className="badge badge-gradient-info">
                                          Response 5
                                        </div>
                                        <div className="wrapper">
                                          <Alert variant="info">
                                            <h5>{x["response4"]}</h5>
                                          </Alert>
                                        </div>
                                      </div>
                                      <div className="tickets-details col-lg-3 col-3">
                                        <div className="badge badge-gradient-info">
                                          Response 6
                                        </div>
                                        <div className="wrapper">
                                          <Alert variant="info">
                                            <h5>{x["response4"]}</h5>
                                          </Alert>
                                        </div>
                                      </div>
                                      <div className="tickets-details col-lg-3 col-3">
                                        <div className="badge badge-gradient-info">
                                          Response 7
                                        </div>
                                        <div className="wrapper">
                                          <Alert variant="info">
                                            <h5>{x["response4"]}</h5>
                                          </Alert>
                                        </div>
                                      </div>
                                      <div className="tickets-details col-lg-3 col-3">
                                        <div className="badge badge-gradient-info">
                                          Response 8
                                        </div>
                                        <div className="wrapper">
                                          <Alert variant="info">
                                            <h5>{x["response4"]}</h5>
                                          </Alert>
                                        </div>
                                      </div>
                                    </div>
                                    <div className=" row mx-1 col-lg-2 col-2">
                                      <div className="tickets-details col-lg-1 col-1 ">
                                        <div className="tickets-details col-lg-1 col-1">
                                          <div className="badge badge-gradient-danger">
                                            已选择的最差答案
                                          </div>
                                          <div className="wrapper">
                                            <Dropdown>
                                              <Dropdown.Toggle
                                                variant="btn btn-gradient-light"
                                                id="dropdownMenuOutlineButton1"
                                              >
                                                {
                                                  inactiveTickets[index]
                                                    .worstAns
                                                }
                                              </Dropdown.Toggle>
                                            </Dropdown>
                                          </div>
                                          <div className="badge badge-gradient-primary">
                                            已选择的最优答案
                                          </div>
                                          <div className="wrapper">
                                            <Dropdown>
                                              <Dropdown.Toggle
                                                variant="btn btn-gradient-light"
                                                id="dropdownMenuOutlineButton1"
                                              >
                                                {inactiveTickets[index].bestAns}
                                              </Dropdown.Toggle>
                                            </Dropdown>
                                          </div>
                                          <button
                                            type="button"
                                            className="btn btn-gradient-dark"
                                            style={{
                                              width: "150px",
                                            }}
                                            onClick={() => handleRevoke(index)}
                                          >
                                            Revoke
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              );
                            })}
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
