import React, { useState, useEffect } from "react";
import { ProgressBar } from "react-bootstrap";

const Dashboard = () => {
  const [allusers, setAllUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalDoneCount, setTotalDoneCount] = useState(0);
  const [allUsersDone, setAllUsersDone] = useState({});

  useEffect(() => {
    fetch(`http://172.22.215.62:5000/login/allUsers`)
      .then((res) => res.json())
      .then((users) => {
        setAllUsers(users);
        console.log("These users are", users);
        users.map((user) => {
          try {
            fetch(
              `http://172.22.215.62:5000/descr/countUser?high=${user.high_index}&low=${user.low_index}`
            )
              .then((res) => res.json())
              .then(({ doneTickets }) => {
                // return doneTickets;
                setAllUsersDone({
                  ...allUsersDone,
                  [user.username]: doneTickets,
                });
              });
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        });
      });

    console.log(allusers);

    fetch(`http://172.22.215.62:5000/descr/countAll`)
      .then((res) => res.json())
      .then(({ allTickets, doneTickets }) => {
        setTotalCount(allTickets);
        setTotalDoneCount(doneTickets);
      });
  }, []);

  const toggleProBanner = () => {
    document.querySelector(".proBanner").classList.toggle("d-none");
  };

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
              <h2 className="mb-5">{totalCount}</h2>
              <h6 className="card-text">
                Completed {((totalDoneCount / totalCount) * 100).toFixed(2)}%
              </h6>
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
              <h2 className="mb-5">{allusers.length}</h2>
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
                    <th> Name </th>
                    <th> Position </th>
                    <th> Progress </th>
                    <th> Num of Cases </th>
                    {/* <th> Deadline </th> */}
                  </tr>
                </thead>
                <tbody>
                  {allusers.map((user) => {
                    let totalCount = user.high_index - user.low_index + 1;
                    return (
                      <tr key={user.username}>
                        <td className="py-1">
                          <img
                            src={
                              user.sex == "female"
                                ? require("../../assets/images/faces/female.jpg")
                                : require("../../assets/images/faces/male.jpg")
                            }
                            alt="user icon"
                          />
                        </td>
                        <td> {user.username} </td>
                        <td> {user.position} </td>
                        <td>
                          <ProgressBar
                            variant="success"
                            now={
                              (allUsersDone[user.username] / totalCount) * 100
                            }
                          />
                        </td>
                        <td> {totalCount} </td>
                        {/* <td> May 15, 2015 </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
