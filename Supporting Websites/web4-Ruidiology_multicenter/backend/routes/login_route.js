// login_route.js

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Define the user schema with appropriate fields
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  // Add any other fields as needed
});

// Use the userSchema in the model
const User = mongoose.model("users", userSchema);

module.exports = {
  handle: async (req, res, next) => {
    const path = req.path;
    const method = req.method;

    if (method === 'GET') {
      console.log("Method is GET");

      if (path === '/login') {
        console.log('Path is /login');

        // Extract query parameters
        const { usr, pw } = req.query;

        try {
          // Find user with matching username and password
          const data = await User.find({ username: usr, password: pw });
          res.status(200).json(data);
        } catch (error) {
          console.error("Error finding user:", error);
          res.status(500).json({ message: 'Internal Server Error' });
        }

        // No need to call cb() anymore

      } else if (path === '/login/allUsers') {
        console.log('Path is /login/allUsers');

        try {
          // Retrieve all users
          const data = await User.find();
          res.status(200).json(data);
        } catch (error) {
          console.error("Error fetching users:", error);
          res.status(500).json({ message: 'Internal Server Error' });
        }

        // No need to call cb() anymore

      } else {
        // Handle unknown paths under GET method
        res.status(404).json({ message: 'Not found' });
      }

    } else {
      // Handle methods other than GET
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }
};
