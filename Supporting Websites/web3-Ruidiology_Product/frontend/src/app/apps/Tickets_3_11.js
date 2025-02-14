import React, { useEffect, useState, useContext, useRef } from "react";
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
  const context = useContext(AuthContext);
  const [allTicketsIds, setAllTicketsIds] = useState([]);
  const runCount = useRef(0);

  const responseTitles = ['Response 1', 'Response 2', 'Response 3', 'Reposne 4', 'Response 5', 'Response 6', 'Response 7', 'Response 8', 'Response 9', 'Response 10']

  const radioButtonGroupNames = ['C', 'H', 'A', 'R', 'M'];

  const [records, setRecords] = useState({});

  const emptyState = ['', '', '', '', '', '', '', '', '']

  useEffect(() => {
    if (runCount.current < 1) {
      console.log("componentDidMount", context.user);
      fetch(
        `http://localhost:5001/descr?low=${context.user.low_index}&high=${context.user.high_index}`
      )
        .then((res) => res.json())
        .then((tickets) => {
          setRecords(() => {
            return tickets.map((ticket) => ({
              recordId: ticket.idx,
              responses: Array.from({ length: 10 }, (_, index) => ({
                questionId: ticket.idx + '_' + index,
                questions: (() => {
                  if (ticket.c_score == emptyState && ticket.h_score == emptyState && ticket.a_score == emptyState && ticket.r_score == emptyState && ticket.m_score == emptyState) {
                    return radioButtonGroupNames.reduce((answers, groupName) => {
                      answers[groupName] = ''; // Initialize each group with an empty string
                      return answers;
                    }, {})
                  }
                  // else condition or return states pulled from database
                  return radioButtonGroupNames.reduce((answers, groupName) => {
                    console.log('answer', ticket[groupName][index])
                    answers[groupName] = ticket[groupName][index];
                    return answers;
                  }, {})
                })()
              }))
            }))
          })

          const total_count = tickets.length;
          setTotalCount(total_count);

          const ticketIds = tickets.map(ticket => ticket.idx)
          setAllTicketsIds(ticketIds)

          const active_tickets = tickets.filter(
            (item) => item.status === "active"
          );
          const inactive_tickets = tickets.filter(
            (item) => item.status === "inactive"
          );

          setActiveTickets(active_tickets);
          setInactiveTickets(inactive_tickets);

          return {
            activeTickets: active_tickets,
            inactiveTickets: inactive_tickets,
          };
        })
        .then(({ activeTickets }) => {
          // setActiveTicketBestStates(
          //   activeTickets.map((x) => (x.bestAns == 0 ? "请选择" : x.bestAns))
          // );
          // setActiveTicketWorstStates(
          //   activeTickets.map((x) => (x.worstAns == 0 ? "请选择" : x.worstAns))
          // );
        })
      runCount.current += 1;
    }
  }, []);

  const ResponseCard = ({ recordIndex, answerIndex, title, response, onChange, active }) => (
    <div className="tickets-details col-lg-2 col-2 p-1 flex-fill">
      <div className="badge badge-gradient-info">{title}</div>
      <div className="wrapper">
        <Alert variant="info">
          <h5>{response}</h5>
        </Alert>
      </div>
      {radioButtonGroupNames.map((groupName, index) => (
        <RadioButtonGroup
          key={records[recordIndex].idx + '_' + records[recordIndex].responses[answerIndex].questionId + '_' + groupName + '_' + index}
          recordIndex={recordIndex}
          answerIndex={answerIndex}
          value={records[recordIndex].responses[answerIndex].questions[groupName]}
          groupName={groupName}
          active={active}
          onChange={(recordIndex, answerIndex, selectedValue) => onChange(recordIndex, answerIndex, selectedValue, groupName)}
        />
      ))}
    </div>
  );




  // Function to update the selected radio button value for a specific answer
  const updateAnswer = (recordIndex, answerIndex, selectedValue) => {
    setRecords((prevRecords) =>
      prevRecords.map((record, index) => {
        if (index === recordIndex) {
          return {
            ...record,
            answers: record.answers.map((answer, idx) => {
              if (idx === answerIndex) {
                return { ...answer, value: selectedValue };
              }
              return answer;
            }),
          };
        }
        return record;
      })
    );
  };

  function handleRadioChange(recordId, questionId, newValue, groupName) {
    console.log('all state', records)
    console.log('allrecordid', 'recordId:', recordId, 'questionId:', questionId, 'groupName:', groupName, 'newValue:', newValue)
    console.log('original state', records[recordId].responses[questionId])
    setRecords(records => records.map((record, index) => {
      if (index !== recordId) {
        // This isn't the item we care about - keep it as-is
        return record;
      }

      // Otherwise, this is the one we want - return an updated value
      return {
        ...record,
        responses: record.responses.map((response, index) => {
          if (index !== questionId) {

            // This isn't the item we care about - keep it as-is
            return response;
          }

          // Otherwise, this is the one we want - return an updated value
          console.log('response', response)
          return {
            ...response,
            questions: {
              ...response.questions,
              [groupName]: newValue
            }
          }
        })
      }
    }))

    setActiveTickets(activeTickets => activeTickets.map((ticket, index) => {
      if (index !== recordId) {
        // This isn't the item we care about - keep it as-is
        return ticket;
      }
      // Otherwise, this is the one we want - return an updated value
      console.log('active ticket', ticket)
      ticket[groupName][questionId] = newValue
      console.log('the ticket state is: -------------', index, groupName, ticket[groupName][questionId - 1])
      return {
        ...ticket,
      }
    }))
  }



  const handleSubmit = (index) => {
    // const targetTicketState = records.filter((record, id) => record.recordId === activeTickets[index].idx)[0];
    // console.log('targetTicketState', targetTicketState)

    fetch(
      `http://localhost:5001/descr/updttnew?idx=${activeTickets[index].idx}&A=${activeTickets[index]['A']}&C=${activeTickets[index]['C']}&H=${activeTickets[index]['H']}&M=${activeTickets[index]['M']}&R=${activeTickets[index]['R']}`,
      { method: "PUT" }
    ).then((res) => res.json());

    console.log('the handling ticket is: ', activeTickets[index])
    console.log('the handling ticket idx is: ', activeTickets[index].idx)
    console.log('index is: ', activeTickets[index]['A'])

    // const targetTicket = activeTickets[index];
    const targetTicket = activeTickets[index];

    const updatedActiveTickets = activeTickets.filter(
      (ticket) => ticket.idx !== targetTicket.idx
    );

    console.log('the updatedActiveTickets is: ', updatedActiveTickets)

    setActiveTickets(updatedActiveTickets);

    setInactiveTickets([...inactiveTickets, targetTicket]);
  };

  const handleRevoke = (index) => {
    fetch(
      `http://localhost:5001/descr/activatenew?idx=${inactiveTickets[index].idx}`,
      { method: "PUT" }
    ).then((res) => res.json());

    const targetTicket = inactiveTickets[index];

    const updatedInactiveTickets = inactiveTickets.filter(
      (ticket) => ticket.idx !== targetTicket.idx
    );

    setInactiveTickets(updatedInactiveTickets);
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
                                  key={x.idx + '_' + index}
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
                                        <div className="tickets-details col-lg-1 col-1"></div>

                                        <div className="d-flex justify-content-between">
                                          <Row className="d-flex justify-content-between">
                                            {responseTitles.map((title, answerIndex) => (
                                              <ResponseCard
                                                key={title + '_' + answerIndex + '_' + index}
                                                recordIndex={index}
                                                answerIndex={answerIndex}
                                                title={title}
                                                response={x[`${'response' + (answerIndex + 1)}`]}
                                                active={true}
                                                onChange={(recordIndex, answerIndex, selectedValue, groupName) => handleRadioChange(recordIndex, answerIndex, selectedValue, groupName)}
                                              />
                                            ))}
                                            <div className="tickets-details col-lg-2 col-2 "></div>
                                            <button
                                              type="button"
                                              className="btn btn-gradient-success align-self-center col-lg-2 col-2"
                                              style={{
                                                width: "130px",
                                                height: "80px",
                                              }}
                                              onClick={() =>
                                                handleSubmit(index)
                                              }
                                            >
                                              Submit
                                            </button>
                                          </Row>
                                        </div>
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
                                  key={x.idx + '_' + index}
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
                                        <div className="tickets-details col-lg-1 col-1"></div>

                                        <div className="d-flex justify-content-between">
                                          <Row className="d-flex justify-content-between">
                                            {responseTitles.map((title, answerIndex) => (
                                              <ResponseCard
                                                key={x.idx + title + '_' + answerIndex + '_' + index}
                                                recordIndex={index}
                                                answerIndex={answerIndex}
                                                title={title}
                                                response={x[`${'response' + (answerIndex + 1)}`]}
                                                active={false}
                                                onChange={(recordIndex, answerIndex, selectedValue, groupName) => handleRadioChange(recordIndex, answerIndex, selectedValue, groupName)}
                                              />
                                            ))}
                                            <div className="tickets-details col-lg-2 col-2 "></div>
                                            <button
                                              type="button"
                                              className="btn btn-gradient-dark align-self-center col-lg-2 col-2"
                                              style={{
                                                width: "130px",
                                                height: "80px",
                                              }}
                                              onClick={() =>
                                                handleRevoke(index)
                                              }
                                            >
                                              Revoke
                                            </button>
                                          </Row>
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
