// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
require('dotenv').config()
const sgMail = require('@sendgrid/mail');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
app.use(bodyParser.json());
app.use(cors());


emailarr = ['huntapplegate@gmail.com', 'hunt@huntcodes.co']
const msg = {
    to: emailarr,
    from: 'test@example.com',
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<div><h2>Paragraph 1</h2><p><strong>and easy to do anywhere, even with Node.js</strong></p><h2>Paragraph 2</h2><p><strong>and easy to do anywhere, even with Node.js</strong></p></div>',
};

app.listen(port, (req, res) => {
    console.log(`listening on ${port}`);
});

app.get('/', (req, res, next) => {
    res.send('working')
})

app.post('/', (req, res, next) => {
    res.send('working')
    console.log('msg', msg)
    sgMail.sendMultiple(msg)
})


