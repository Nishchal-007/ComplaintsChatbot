const express = require("express");
const { WebhookClient } = require("dialogflow-fulfillment");
const { welcome, defaultFallback } = require("./intents/welcomeExit");
const app = express();
app.post("/dialogflow", express.json(), (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });
    let intentMap = new Map();
    intentMap.set("Default Welcome Intent", welcome);
    intentMap.set("Default Fallback Intent", defaultFallback);
    agent.handleRequest(intentMap);
});

function welcome(agent) {
    agent.add(
        "Hi, I am assistant. I can help you in various service. How can I help you today?"
    );
}

function defaultFallback(agent) {
    agent.add(
        "Sorry! I am unable to understand this at the moment. I am still learning humans. You can pick any of the service that might help me."
    );
}
module.exports = { welcome: welcome, defaultFallback: defaultFallback };

app.listen(process.env.PORT || 3333);
