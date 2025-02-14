// index.js

const express = require("express");
const mongoose = require("mongoose");
// Removed the import of better-queue
// const Queue = require('better-queue');
const app = express();
const db_route = require("./routes/db_route");
const login_route = require("./routes/login_route");
const cors = require("cors");
const MongoStore = require('connect-mongo');

const session = require("express-session");
const rateLimit = require("express-rate-limit");

app.use(
  session({
    secret: "your secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 * 60 * 720 }, // 720 hours
    // store: MongoStore.create({
    //   mongoUrl: "mongodb://127.0.0.1:27017/IMIT_multi_center_reports",
    // }), // Use MongoDB for session storage
  })
);

app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
});

app.use(limiter);

// Removed the queue-related middleware
// app.use("/", (req, res, next) => {
//   queue.push({ req, res, done: next });
// });

// Use standard Express route handling
app.use("/", (req, res, next) => {
  handleRequest(req, res, next);
});

// Removed the queue initialization
// const queue = new Queue((input, cb) => {
//   handleRequest(input.req, input.res, input.done, cb);
// });

// Adjusted the handleRequest function to remove the 'cb' parameter
const handleRequest = (req, res, next) => {
  console.log(
    "Method:",
    req.method,
    "Path:",
    req.path
  );
  if (req.path.startsWith("/descr")) {
    db_route.handle(req, res, next);
  } else if (req.path.startsWith("/login")) {
    login_route.handle(req, res, next);
  } else {
    // If the request doesn't match any of the routes, send a 404 response
    res.status(404).send("Not found");
  }
};

const connectDB = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/IMIT_multi_center_reports", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Adjust maxPoolSize to a reasonable value or remove it to use default
      // maxPoolSize: 100,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
};

connectDB();

app.listen(8001, () => {
  console.log("Backend app listening on port 8001!");
});
