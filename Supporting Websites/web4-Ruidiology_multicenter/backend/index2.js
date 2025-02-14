const express = require("express");
const mongoose = require("mongoose");
const app = express();
const db_route = require("./routes/db_route");
const login_route = require("./routes/login_route");
const cors = require("cors");

app.use(cors());

app.use((req, res, next) => {
  console.log("the method and path is", req.method, "and path is, ", req.path);
  if (req.path.startsWith('/descr')) {
    db_route.handle(req, res, next);
  } else if (req.path.startsWith('/login')) {
    login_route.handle(req, res, next);
  } else {
    // If the request doesn't match any of the routes, send a 404 response
    res.status(404).send('Not found');
  }
});

const connectDB = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/IMIT_Img_Reports_news", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
};

connectDB();

app.listen(5001, () => {
  console.log("Backend app listening on port 5001!");
});