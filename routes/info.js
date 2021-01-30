const express = require("express");
const app = express.Router();
var mongoUtil = require("../mongoUtil");
var DB = mongoUtil.getDb1();

var db = DB.collection("usersInformations");

app.get("/", (req, res) => {
    db.find()
        .toArray()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => console.log(err));
});

app.post("/add", (req, res) => {
    db.insertOne(req.body)
        .then(() => {
            res.send("Data added");
        })
        .catch((err) => res.send(err));
});

app.delete("/delete/:name", (req, res) => {
    var id = req.params.name;
    db.remove({ name: id })
        .then(() => {
            res.send("Deleted Successfully");
        })
        .catch((err) => res.send(err));
});

module.exports = app;
