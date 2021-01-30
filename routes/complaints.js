const express = require("express");
const app = express.Router();
var mongoUtil = require("../mongoUtil");
var DB = mongoUtil.getDb2();

var db = DB.collection("userComplaints");

app.get("/", (req, res) => {
    db.find()
        .toArray()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => console.log(err));
});

app.post("/add", (req, res) => {
    /*
    ! ---------------- body params ---------------- !
    ? phoneNo
    ? username
    ? Issue
    ? status => started, Inprogress, finished
    ? troubleTicket
    */

    const uniqueKey =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

    db.insertOne({ troubleTicket: uniqueKey, ...req.body })
        .then(() => {
            res.send("Data added");
        })
        .catch((err) => res.send(err));
});

app.delete("/delete/:phoneNo", (req, res) => {
    var id = req.params.phoneNo;
    db.remove({ phoneNo: id })
        .then(() => {
            res.send("Deleted Successfully");
        })
        .catch((err) => res.send(err));
});

app.delete("/deleteTrouble/:tt", (req, res) => {
    var id = req.params.tt;
    db.deleteOne({ troubleTicket: id })
        .then(() => {
            res.send("Deleted with Trouble Ticket Successfully");
        })
        .catch((err) => res.send(err));
});

module.exports = app;
