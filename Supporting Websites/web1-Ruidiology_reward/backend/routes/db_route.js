const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const mongoose = require("mongoose");

const dbschema = new mongoose.Schema({
  _id: ObjectId,
  idx: Number,
  bestAns: String,
  worstAns: String,
  status: String,
  g_truth: String,
  response1: String,
  response2: String,
  response3: String,
  response4: String,
  year: Number,
});
// const dt = mongoose.model("img_reports_new0s", dbschema);
const dt = mongoose.model("real_imgs_reports", dbschema);

router.get("/", async (req, res) => {
  const { high, low } = req.query;
  console.log("this high and low is ", high, low);
  const data = await dt.find({
    idx: {
      $lte: Number(high),
      $gte: Number(low),
    },
  });
  res.send(data).status(200);
});

router.get("/countAll", async (req, res) => {
  const allTickets = await dt.countDocuments();
  const doneTickets = await dt.countDocuments({
    status: {
      $eq: "inactive",
    },
  });
  res.send({ allTickets, doneTickets }).status(200);
});

router.get("/countUser", async (req, res) => {
  const { high, low } = req.query;
  const doneTickets = await dt.countDocuments({
    status: {
      $eq: "inactive",
    },
    idx: {
      $lte: Number(high),
      $gte: Number(low),
    },
  });
  res.send({ doneTickets }).status(200);
});

router.put("/updtt", async (req, res) => {
  const { idx, best, worst } = req.query;
  console.log("this idx, best, worst is ", idx, best, worst);
  const filter = { idx: idx };
  const update = {
    $set: { bestAns: best, worstAns: worst, status: "inactive" },
  };

  try {
    const result = await dt.updateMany(filter, update);
    if (result.modifiedCount > 0) {
      console.log("Documents updated successfully.", result);
    } else {
      console.log("No documents were updated.", result);
    }
  } catch (error) {
    console.error("Error updating documents:", error);
  }
});

router.put("/activate", async (req, res) => {
  const { idx } = req.query;
  const filter = { idx: idx };
  const update = {
    $set: { status: "active" },
  };

  try {
    const result = await dt.updateMany(filter, update);
    if (result.modifiedCount > 0) {
      console.log("Documents updated successfully.", result);
    } else {
      console.log("No documents were updated.", result);
    }
  } catch (error) {
    console.error("Error updating documents:", error);
  }
});

module.exports = router;
