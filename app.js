// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const dotenv = require('dotenv')
const port = process.env.PORT || 4000;
const queries = require("./queries")

dotenv.config()
sgMail.setApiKey(process.env.SGKEY);
app.use(bodyParser.json());
app.use(cors());


emailarr = ['huntapplegate@gmail.com', 'hunt@huntcodes.co']
const msg1 = {
  to: emailarr,
  from: 'test@example.com',
  subject: 'Thank you for signing up',
  text: 'Welcome to arthuranteater!',
  html: '<div><h2>Welcome</h2><p><strong>Welcome to arthuranteater!</strong></p><h2>Latest Post</h2><p><strong>How-to-Redux</strong></p></div>',
};

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


//to send post, get subscribers by category, add email addresses, and send

app.get("/:cat", (req, res) => {
  queries.getByCat(req.params.cat).then(data => {
    res.json({ data })
    sgMail.sendMultiple(msg)
  });
});

//to create new suscriber

app.post("/suscribers/", (req, res) => {
  queries.createSubscriber(req.body).then(data => {
    res.json({ data })
    sgMail.send(msg1)
  });
});

//to delete subscriber

app.delete("/:code", (req, res) => {
  queries.deleteSubscriber(req.params.code).then(data => res.json({ data }));
});

//to add new blog post

app.post("/posts/", (req, res, next) => {
  res.send('working')
  console.log('msg', msg)
  sgMail.sendMultiple(msg)
})


