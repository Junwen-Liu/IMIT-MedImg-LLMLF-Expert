const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
    _id: String,
    seq: { type: Number, default: 0 }
});

const counter = mongoose.model('Counter', counterSchema);

const dbschema = new mongoose.Schema({
    idx: { type: Number, default: 0 },
    totalTime: String,
    username: String,
    question: String,
    generatedAnswer: String,
    finalAnswer: String,
    date: String  // To automatically capture the time of interaction
});

dbschema.pre('save', async function (next) {
    if (this.isNew) {
        const counterDoc = await updateCounter('prosp_records');
        this.idx = counterDoc.seq;
    }
    next();
});

// const dt = mongoose.model("img_reports_new0s", dbschema);
// const dt = mongoose.model("real_imgs_reports", dbschema);
const dt = mongoose.model("prosp_records", dbschema);

function updateCounter(modelName) {
    return counter.findByIdAndUpdate(
        modelName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
}

module.exports = {
    handle: async (req, res, cb) => {
        const path = req.path;
        const method = req.method;
        console.log("the method and path is", method, path);
        if (method === 'GET') {
            if (path === '/db_prosp/getall') {
                // Handle GET /getall route
                // Call cb() when you're done sending the response
                try {
                    const data = await dt.find().sort({ idx: -1 });;
                    console.log("Data fetched successfully.");
                    res.send(data);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    res.status(500).send('Error getting all data');
                } finally {
                    cb();
                }

            }
        } else if (method === 'POST') {
            if (path === '/db_prosp/insert') {
                // Handle POST /insert route
                // You can use req.body to access the JSON payload
                // Call cb() when you're done sending the response
                const { totalTime, username, question, generatedAnswer, finalAnswer } = req.body;
                console.log("this totalTime, username, question, generatedAnswer, finalAnswer is ", totalTime, username, question, generatedAnswer, finalAnswer);
                const data = new dt({
                    totalTime: totalTime,
                    username: username,
                    question: question,
                    generatedAnswer: generatedAnswer,
                    finalAnswer: finalAnswer,
                    date: new Date()
                });
                try {
                    await data.save();
                    console.log("Data saved successfully.");
                    res.json({ message: 'Data saved successfully' });
                } catch (error) {
                    console.error("Error saving data:", error);
                    res.status(500).send('Error saving data');
                } finally {
                    cb();
                }
            }
        } else if (method === 'PUT') {
            if (path === '/db_prosp/delete') {
                // Handle PUT /delete route
                // You can use req.body to access the JSON payload
                // Call cb() when you're done sending the response
                const { id } = req.body;
                console.log("this id is ", id);
                try {
                    await dt.deleteOne({ _id: ObjectId(id) });
                    console.log("Data deleted successfully.");
                    res.json({ message: 'Data deleted successfully' });
                } catch (error) {
                    console.error("Error deleting data:", error);
                    res.status(500).send('Error deleting data');
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
