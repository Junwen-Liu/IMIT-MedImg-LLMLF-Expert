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
  Clarity: Array,
  Helpfulness: Array,
  Accuracy: Array,
  Redundancy: Array,
  Misleading: Array
});

// const dt = mongoose.model("img_reports_new0s", dbschema);
// const dt = mongoose.model("real_imgs_reports", dbschema);
const dt = mongoose.models.multicenter_reports_news || mongoose.model('multicenter_reports_news', dbschema);


// ... (rest of your code)

module.exports = {
  handle: async (req, res, next, cb) => {
    const path = req.path;
    const method = req.method;
    console.log("the method and path is", method, path);
    if (method === 'GET') {
      if (path === '/descr') {
        // Handle GET / route
        // You can use req.query to access query parameters
        // Call cb() when you're done sending the response
        const { high, low } = req.query;
        console.log("this high and low is ", high, low);
        const data = await dt.find({
          idx: {
            $lte: Number(high),
            $gte: Number(low),
          },
        });
        try {
          res.send(data).status(200);
        } catch (error) {
          console.error("Database error:", error);
          res.status(500).json({ message: "Database error" });
        } finally {
          cb();
        }

      } else if (path === '/descr/countAll') {
        // Handle GET /countAll route
        // Call cb() when you're done sending the response
        const allTickets = await dt.countDocuments();
        const doneTickets = await dt.countDocuments({
          status: {
            $eq: "inactive",
          },
        });
        try {
          res.send({ allTickets, doneTickets }).status(200);
        } catch {
          console.error("Database error:", error);
          res.status(500).json({ message: "Database error" });
        } finally {
          cb();
        }
      } else if (path === '/descr/countUser') {
        // Handle GET /countUser route
        // Call cb() when you're done sending the response
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
        try {
          res.send({ doneTickets }).status(200);
        } catch {
          console.error("Database error:", error);
          res.status(500).json({ message: "Database error" });
        } finally {
          cb();
        }
      }
    } else if (method === 'PUT') {
      if (path === '/descr/updtt') {
        // Handle PUT /updtt route
        // Call cb() when you're done sending the response
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
          res.status(500).json({ message: "Database error" });
        } finally {
          cb();
        }
      } else if (path === '/descr/updttnew') {
        // Handle PUT /updttnew route
        // Call cb() when you're done sending the response
        const { idx, A, C, H, M, R } = req.query;
        const filter = { idx: idx };

        const update = {
          $set: { A: A.split(',').map(String), C: C.split(',').map(String), H: H.split(',').map(String), M: M.split(',').map(String), R: R.split(',').map(String), status: "inactive" },
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
        } finally {
          cb();
        }
      } else if (path === '/descr/activatenew') {
        // Handle PUT /activatenew route
        // Call cb() when you're done sending the response
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
        } finally {
          cb();
        }
      } else if (path === '/descr/activate') {
        // Handle PUT /activate route
        // Call cb() when you're done sending the response
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
        } finally {
          cb();
        }

      }
    } else {
      // If the method is not GET or PUT, send a 405 Method Not Allowed response
      res.status(405).send('Method Not Allowed');
      cb();
    }
  }
};
