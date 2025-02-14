const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const dbschema = new mongoose.Schema({});
const dt = mongoose.model("users", dbschema);

module.exports = {
  handle: async (req, res, next, cb) => {
    const path = req.path;
    const method = req.method;
    if (method === 'GET') {
      console.log("method is GET");
      if (path === '/login') {
        console.log('path is /login')
        // Handle GET / route
        // You can use req.query to access query parameters
        // Call cb() when you're done sending the response
        const { usr, pw } = req.query;
        const data = await dt.find({ username: usr, password: pw });
        res.send(data).status(200);
        cb();
      } else if (path === '/login/allUsers') {
        // Handle GET /allUsers route
        // Call cb() when you're done sending the response
        const data = await dt.find();
        res.send(data).status(200);
        cb();
      }
    } else {
      res.status(404).json({ message: 'Not foundddd' });
      cb();
    }
  }
}
