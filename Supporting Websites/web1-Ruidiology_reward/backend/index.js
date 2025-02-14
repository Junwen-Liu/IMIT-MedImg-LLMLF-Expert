const express = require("express");
const mongoose = require("mongoose");
const app = express();
const db_route = require("./routes/db_route");
const login_route = require("./routes/login_route");
const cors = require("cors");

const connectDB = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/IMIT_Img_Reports", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
};

connectDB();

app.get("/api", async (req, res) => {
  res.send("Hello World!");
});

app.use(cors());
app.use("/descr", db_route);
app.use("/login", login_route);

app.listen(5000, () => {
  console.log("Backend app listening on port 5000!");
});
