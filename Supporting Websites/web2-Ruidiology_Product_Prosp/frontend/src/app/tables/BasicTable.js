import React, { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";

function BasicTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4002/db_prosp/getall')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  const colors = ['table-info', 'table-warning', 'table-danger', 'table-success', 'table-primary'];


  return (
    <div>
      <div className="row">
        <div className="col-lg-12 stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">已录入数据库的前瞻性数据</h4>
              <p className="card-description">
                {" "}
                上海交通大学医学院附属瑞金医院 <code>放射科</code>
              </p>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th><strong> # </strong></th>
                      <th><strong> Comsume time </strong></th>
                      <th><strong> Username </strong></th>
                      <th><strong> question </strong></th>
                      <th><strong> generatedAnswer </strong></th>
                      <th><strong> finalAnswer </strong></th>
                      <th><strong> Date </strong></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr className={colors[index % colors.length]}>
                        <td> {item.idx} </td>
                        <td> {item.totalTime} </td>
                        <td> {item.username} </td>
                        <td style={{ width: '500px', whiteSpace: 'normal', wordWrap: 'break-word' }}> {item.question} </td>
                        <td style={{ width: '500px', whiteSpace: 'normal', wordWrap: 'break-word' }}> {item.generatedAnswer} </td>
                        <td style={{ width: '500px', whiteSpace: 'normal', wordWrap: 'break-word' }}> {item.finalAnswer} </td>
                        <td style={{ width: '500px', whiteSpace: 'normal', wordWrap: 'break-word' }}> {item.date} </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasicTable;
