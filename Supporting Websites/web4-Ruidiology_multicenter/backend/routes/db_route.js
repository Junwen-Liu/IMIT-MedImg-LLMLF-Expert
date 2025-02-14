// db_route.js

const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const mongoose = require("mongoose");

// Define your schema
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
  Clarity: Array,
  Helpfulness: Array,
  Accuracy: Array,
  Redundancy: Array,
  Misleading: Array,
  uptdt: String,
});

// Use existing model if already compiled
const dt =
  mongoose.models.multicenter_reports_news ||
  mongoose.model("multicenter_reports_news", dbschema);

// Export the handle function without 'cb'
module.exports = {
  handle: async (req, res, next) => {
    const path = req.path;
    const method = req.method;
    console.log("Method:", method, "Path:", path);

    if (method === "GET") {
      if (path === "/descr") {
        // Handle GET /descr route
        const { high, low } = req.query;
        console.log("High and low:", high, low);

        try {
          const data = await dt.find({
            idx: {
              $lte: Number(high),
              $gte: Number(low),
            },
          }).sort({ uptdt: -1, idx: 1 });;
          res.status(200).json(data);
        } catch (error) {
          console.error("Database error:", error);
          res.status(500).json({ message: "Database error" });
        }
      } else if (path === "/descr/countAll") {
        // Handle GET /descr/countAll route
        try {
          const allTickets = await dt.countDocuments();
          const doneTickets = await dt.countDocuments({
            status: "inactive",
          });
          res.status(200).json({ allTickets, doneTickets });
        } catch (error) {
          console.error("Database error:", error);
          res.status(500).json({ message: "Database error" });
        }
      } else if (path === "/descr/countUser") {
        // Handle GET /descr/countUser route
        const { high, low } = req.query;
        try {
          const doneTickets = await dt.countDocuments({
            status: "inactive",
            idx: {
              $lte: Number(high),
              $gte: Number(low),
            },
          });
          res.status(200).json({ doneTickets });
        } catch (error) {
          console.error("Database error:", error);
          res.status(500).json({ message: "Database error" });
        }
      } else {
        // Handle unknown paths under GET method
        res.status(404).json({ message: "Not Found" });
      }
    } else if (method === "PUT") {
      if (path === "/descr/updtt") {
        // Handle PUT /descr/updtt route
        const { idx, best, worst } = req.query;
        console.log("idx, best, worst:", idx, best, worst);
        const filter = { idx: idx };
        const update = {
          $set: { bestAns: best, worstAns: worst, status: "inactive" },
        };

        try {
          const result = await dt.updateMany(filter, update);
          if (result.modifiedCount > 0) {
            console.log("Documents updated successfully.", result);
            res.status(200).json({ message: "Update successful", result });
          } else {
            console.log("No documents were updated.", result);
            res.status(404).json({ message: "No documents were updated", result });
          }
        } catch (error) {
          console.error("Error updating documents:", error);
          res.status(500).json({ message: "Database error" });
        }
      } else if (path === "/descr/updttnew") {
        // Handle PUT /descr/updttnew route
        const { idx, Accuracy, Clarity, Helpfulness, Misleading, Redundancy } = req.query;
        const filter = { idx: idx };

        try {
          const update = {
            $set: {
              Accuracy: Accuracy ? Accuracy.split(",") : [],
              Clarity: Clarity ? Clarity.split(",") : [],
              Helpfulness: Helpfulness ? Helpfulness.split(",") : [],
              Misleading: Misleading ? Misleading.split(",") : [],
              Redundancy: Redundancy ? Redundancy.split(",") : [],
              status: "inactive",
              uptdt: Date.now(),
            },
          };

          const result = await dt.updateMany(filter, update);
          if (result.modifiedCount > 0) {
            console.log("Documents updated successfully.", result);
            res.status(200).json({ message: "Update successful", result });
          } else {
            console.log("No documents were updated.", result);
            res.status(404).json({ message: "No documents were updated", result });
          }
        } catch (error) {
          console.error("Error updating documents:", error);
          res.status(500).json({ message: "Database error" });
        }
      } else if (path === "/descr/activatenew" || path === "/descr/activate") {
        // Handle PUT /descr/activatenew and /descr/activate routes
        const { idx } = req.query;
        const filter = { idx: idx };
        const update = {
          $set: {
            status: "active",
            uptdt: Date.now(),
          },
        };

        try {
          const result = await dt.updateMany(filter, update);
          if (result.modifiedCount > 0) {
            console.log("Documents updated successfully.", result);
            res.status(200).json({ message: "Update successful", result });
          } else {
            console.log("No documents were updated.", result);
            res.status(404).json({ message: "No documents were updated", result });
          }
        } catch (error) {
          console.error("Error updating documents:", error);
          res.status(500).json({ message: "Database error" });
        }
      } else {
        // Handle unknown paths under PUT method
        res.status(404).json({ message: "Not Found" });
      }
    } else {
      // If the method is not GET or PUT, send a 405 Method Not Allowed response
      res.status(405).json({ message: "Method Not Allowed" });
    }
  },
};
