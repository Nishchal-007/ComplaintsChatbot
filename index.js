var mongoUtil = require("./mongoUtil");
const express = require("express");
let bodyParser = require("body-parser");
const df = require("dialogflow-fulfillment");

const app = express();

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());

var uname = "";
var pno = "";

mongoUtil.connectToServer((err, client) => {
    var DB1 = mongoUtil.getDb1();
    var db1 = DB1.collection("usersInformations");

    var DB2 = mongoUtil.getDb2();
    var db2 = DB2.collection("userComplaints");

    if (err) console.log(err);
    // HomePage Route
    app.get("/", (req, res) => {
        res.sendFile(__dirname + "/index.html");
    });
    
    app.post("/dialogflow", express.json(), (req, res) => {
        const agent = new df.WebhookClient({ request: req, response: res });
        function welcome(agent) {
            agent.add(
                "Human presence detected. . . .\n\nActivating batch process I.N.T.E.R.A.C.T\n\nHuman, Please provide your phone number"
            );
        }
        const phNo = agent.parameters.phoneNumber;
        let userData;
        let isPresent;
        let ttt;
        async function complaints(agent) {
            const getInfo = await db1
                .findOne({ phoneNo: phNo })
                .then((data) => {
                    uname = data.name;
                    pno = phNo;
                    userData = data;
                });

            const findDup = await db2
                .findOne({ phoneNo: pno })
                .then((snapshot) => {
                    isPresent = snapshot == null ? null : snapshot.Issue;
                    ttt = snapshot == null ? null : snapshot.troubleTicket;
                });
            console.log(isPresent);

            if (userData == null) {
                agent.add("Re-enter phone number");
            } else {
                console.log(userData.name);
                if (isPresent == null) {
                    agent.add("Human " + userData.name + " state your issue");
                } else {
                    agent.add(
                        "Human " +
                            userData.name +
                            ", your recorded issue is: " +
                            isPresent
                    );
                    agent.add("Your assigned Trouble Ticket is: " + ttt);
                    agent.add("The issue's status is: InProgress");
                    agent.add(
                        "For further information please contact customer care :)"
                    );
                }
            }
        }

        async function IssueRec(agent) {
            const uniqueKey =
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);

            const issues = agent.parameters.issue;

            const getIssue = await db2
                .insertOne({
                    phoneNo: pno,
                    username: uname,
                    Issue: issues,
                    status: "started",
                    troubleTicket: uniqueKey,
                })
                .then((data) => {
                    //console.log(data);
                });
            let tt;
            const getiu = await db2
                .findOne({ username: uname })
                .then((data) => {
                    console.log(data);
                    tt = data.troubleTicket;
                });
            if (tt == null) {
                await agent.add("Re-state your issue");
            } else {
                await agent.add(
                    "Your issue is recorded and is sent to our team"
                );
                await agent.add("Your issue is: " + issues);
                await agent.add("Your trouble-ticket No is: " + tt);
                await agent.add(
                    "Thank you and Goodbye human\nExiting Process . . . ."
                );
            }
        }

        let intentMap = new Map();
        intentMap.set("Default Welcome Intent", welcome);
        intentMap.set("Complaints", complaints);
        intentMap.set("Complaints - custom", IssueRec);
        agent.handleRequest(intentMap);
    });

    const infoRoutes = require("./routes/info");
    const complainRoutes = require("./routes/complaints");
    app.use("/info", infoRoutes);
    app.use("/complaint", complainRoutes);
});

// Port number
app.listen(3333, () => console.log("Server running @3333"));
