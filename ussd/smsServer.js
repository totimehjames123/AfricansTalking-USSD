const express = require('express');
const sendSMS = require('./sendSMS');

const app = express();

module.exports = function smsServer() {
    // TODO: Incoming messages route
    app.post('/', (req, res) => {
        const data = req.body;
        console.log(`Received report: \n ${data}`);
        res.sendStatus(200);
      });
};