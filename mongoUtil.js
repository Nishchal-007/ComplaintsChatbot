// Connecting to mongoDB
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017";

var _db1;
var _db2;

module.exports = {
    connectToServer: function (callback) {
        MongoClient.connect(
            url,
            { useUnifiedTopology: true },
            (err, client) => {
                _db1 = client.db("usersInformations");
                _db2 = client.db("userComplaints");
                return callback(err);
            }
        );
    },
    getDb1: function () {
        return _db1;
    },
    getDb2: function () {
        return _db2;
    },
};
