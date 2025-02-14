const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const dbschema = new mongoose.Schema({});
const dt = mongoose.model("users", dbschema);

router.get("/", async (req, res) => {
  // console.log(req.query);
  const { usr, pw } = req.query;
  // console.log("user is ", usr, "password is ", pw);
  const data = await dt.find({ username: usr, password: pw });
  res.send(data).status(200);
});

router.get("/allUsers", async (req, res) => {
  const data = await dt.find();
  res.send(data).status(200);
});

module.exports = router;
