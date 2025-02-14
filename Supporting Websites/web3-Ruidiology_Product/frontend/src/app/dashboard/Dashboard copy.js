import React, { Component } from "react";
import { ProgressBar } from "react-bootstrap";

// import "react-datepicker/dist/react-datepicker.css";

export class Dashboard extends Component {
  handleChange = (date) => {
    this.setState({
      startDate: date,
    });
  };
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      visitSaleData: {},
      visitSaleOptions: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                display: false,
                min: 0,
                stepSize: 20,
                max: 80,
              },
              gridLines: {
                drawBorder: false,
                color: "rgba(235,237,242,1)",
                zeroLineColor: "rgba(235,237,242,1)",
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                display: false,
                drawBorder: false,
                color: "rgba(0,0,0,1)",
                zeroLineColor: "rgba(235,237,242,1)",
              },
              ticks: {
                padding: 20,
                fontColor: "#9c9fa6",
                autoSkip: true,
              },
              categoryPercentage: 0.5,
              barPercentage: 0.5,
            },
          ],
        },
        legend: {
          display: false,
        },
        elements: {
          point: {
            radius: 0,
          },
        },
      },
      trafficData: {},
      trafficOptions: {
        responsive: true,
        animation: {
          animateScale: true,
          animateRotate: true,
        },
        legend: false,
      },
      todos: [
        {
          id: 1,
          task: "Pick up kids from school",
          isCompleted: false,
        },
        {
          id: 2,
          task: "Prepare for presentation",
          isCompleted: true,
        },
        {
          id: 3,
          task: "Print Statements",
          isCompleted: false,
        },
        {
          id: 4,
          task: "Create invoice",
          isCompleted: false,
        },
        {
          id: 5,
          task: "Call John",
          isCompleted: true,
        },
        {
          id: 6,
          task: "Meeting with Alisa",
          isCompleted: false,
        },
      ],
      inputValue: "",
    };
    this.statusChangedHandler = this.statusChangedHandler.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.removeTodo = this.removeTodo.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
  }
  statusChangedHandler(event, id) {
    //const todoIndex = this.state.todos.findIndex( t => t.id === id );
    const todo = { ...this.state.todos[id] };
    todo.isCompleted = event.target.checked;

    const todos = [...this.state.todos];
    todos[id] = todo;

    this.setState({
      todos: todos,
    });
  }

  addTodo(event) {
    event.preventDefault();

    const todos = [...this.state.todos];
    todos.unshift({
      id: todos.length ? todos[todos.length - 1].id + 1 : 1,
      task: this.state.inputValue,
      isCompleted: false,
    });

    this.setState({
      todos: todos,
      inputValue: "",
    });
  }

  removeTodo(index) {
    const todos = [...this.state.todos];
    todos.splice(index, 1);

    this.setState({
      todos: todos,
    });
  }

  inputChangeHandler(event) {
    this.setState({
      inputValue: event.target.value,
    });
  }

  componentDidMount() {
    fetch(`http://localhost:5000/login/allUsers`)
      .then((res) => res.json())
      .then((users) => {
        console.log(users);
      });
  }

  toggleProBanner() {
    document.querySelector(".proBanner").classList.toggle("d-none");
  }
  render() {
    return (
      <div>
        <div className="page-header">
          <h3 className="page-title">
            <span className="page-title-icon bg-gradient-primary text-white me-2">
              <i className="mdi mdi-home"></i>
            </span>{" "}
            Dashboard{" "}
          </h3>
          <nav aria-label="breadcrumb">
            <ul className="breadcrumb">
              <li className="breadcrumb-item active" aria-current="page">
                <span></span>Overview{" "}
                <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
              </li>
            </ul>
          </nav>
        </div>
        <div className="row">
          <div className="col-md-4 stretch-card grid-margin">
            <div className="card bg-gradient-info card-img-holder text-white">
              <div className="card-body">
                <img
                  src={require("../../assets/images/dashboard/circle.png")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h4 className="font-weight-normal mb-3">
                  Total Cases{" "}
                  <i className="mdi mdi-chart-line mdi-24px float-end"></i>
                </h4>
                <h2 className="mb-5">88</h2>
                <h6 className="card-text">Completed 60%</h6>
              </div>
            </div>
          </div>

          <div className="col-md-4 stretch-card grid-margin">
            <div className="card bg-gradient-success card-img-holder text-white">
              <div className="card-body">
                <img
                  src={require("../../assets/images/dashboard/circle.png")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h4 className="font-weight-normal mb-3">
                  Attended Radiologists{" "}
                  <i className="mdi mdi-diamond mdi-24px float-end"></i>
                </h4>
                <h2 className="mb-5">12</h2>
                <h6 className="card-text"></h6>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Real-Time progress</h4>
              <p className="card-description"> </p>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th> User </th>
                      <th> First name </th>
                      <th> Progress </th>
                      <th> Num of Cases </th>
                      {/* <th> Deadline </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1">
                        <img
                          src={require("../../assets/images/faces/female.jpg")}
                          alt="user icon"
                        />
                      </td>
                      <td> Junwen Liu </td>
                      <td>
                        <ProgressBar variant="success" now={25} />
                      </td>
                      <td> 26 </td>
                      {/* <td> May 15, 2015 </td> */}
                    </tr>
                    <tr>
                      <td className="py-1">
                        <img
                          src={require("../../assets/images/faces/female.jpg")}
                          alt="user icon"
                        />
                      </td>
                      <td> Messsy Adam </td>
                      <td>
                        <ProgressBar variant="danger" now={75} />
                      </td>
                      <td> 54 </td>
                      {/* <td> July 1, 2015 </td> */}
                    </tr>
                    <tr>
                      <td className="py-1">
                        <img
                          src={require("../../assets/images/faces/female.jpg")}
                          alt="user icon"
                        />
                      </td>
                      <td> John Richards </td>
                      <td>
                        <ProgressBar variant="warning" now={90} />
                      </td>
                      <td> 65 </td>
                      {/* <td> Apr 12, 2015 </td> */}
                    </tr>
                    <tr>
                      <td className="py-1">
                        <img
                          src={require("../../assets/images/faces/female.jpg")}
                          alt="user icon"
                        />
                      </td>
                      <td> Peter Meggik </td>
                      <td>
                        <ProgressBar variant="primary" now={50} />
                      </td>
                      <td> 54</td>
                      {/* <td> May 15, 2015 </td> */}
                    </tr>
                    <tr>
                      <td className="py-1">
                        <img
                          src={require("../../assets/images/faces/female.jpg")}
                          alt="user icon"
                        />
                      </td>
                      <td> Edward </td>
                      <td>
                        <ProgressBar variant="danger" now={60} />
                      </td>
                      <td>65 </td>
                      {/* <td> May 03, 2015 </td> */}
                    </tr>
                    <tr>
                      <td className="py-1">
                        <img
                          src={require("../../assets/images/faces/female.jpg")}
                          alt="user icon"
                        />
                      </td>
                      <td> John Doe </td>
                      <td>
                        <ProgressBar variant="info" now={100} />
                      </td>
                      <td> 70 </td>
                      {/* <td> April 05, 2015 </td> */}
                    </tr>
                    <tr>
                      <td className="py-1">
                        <img
                          src={require("../../assets/images/faces/female.jpg")}
                          alt="user icon"
                        />
                      </td>
                      <td> Henry Tom </td>
                      <td>
                        <ProgressBar variant="warning" now={80} />
                      </td>
                      <td>77 </td>
                      {/* <td> June 16, 2015 </td> */}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const ListItem = (props) => {
  return (
    <li className={props.isCompleted ? "completed" : null}>
      <div className="form-check">
        <label htmlFor="" className="form-check-label">
          <input
            className="checkbox"
            type="checkbox"
            checked={props.isCompleted}
            onChange={props.changed}
          />{" "}
          {props.children} <i className="input-helper"></i>
        </label>
      </div>
      <i
        className="remove mdi mdi-close-circle-outline"
        onClick={props.remove}
      ></i>
    </li>
  );
};
export default Dashboard;
