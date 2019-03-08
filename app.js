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

//testing variables

const name = 'Hunt'
const email = 'hunt@huntcodes.co'
const tester2 = ['huntapplegate@gmail.com', 'hunt@huntcodes.co']

//working variables
let latestTitle = ''
let LatestSubtitle = ''
let LatestSlug = ''




app.listen(port, (req, res) => {
  console.log(`listening on ${port}`);
});

//to view all posts

app.get("/", (req, res) => {
  queries.listPosts().then(data => {
    res.json({ data })
  })
})

//to send post, get subscribers by category, add email addresses, and send

app.get("/:cat", (req, res) => {
  queries.getByCat(req.params.cat).then(data => {
    res.json({ data })
    sgMail.sendMultiple(post)
  });
});

//to create new suscriber

app.post("/subscribers/", (req, res) => {
  const welcome = {
    to: {
      name: name,
      email: email,
    },
    from: {
      name: 'arthuranteater',
      email: 'no-reply@arthuranteater.com'
    },
    subject: 'Thank you for signing up',
    text: 'Welcome to arthuranteater!',
    html: `<h3><strong>Sharing projects, coding challenges, new tech, and best practices</strong></3><h2>Latest Post</h2><p><strong>How-to-Redux</strong></p><a href="https://arthuranteater.com/unsubscribe" target="_blank">Unsubscribe</a><p id="code"></p></div>`,
  }
  queries.addSubscriber(req.body).then(data => {
    res.json({ data })
    welcome.to.name = data[0].Name
    welcome.to.email = data[0].Email
    welcome.subject = `Thanks for subscribing ${data[0].Name}`
    welcome.html = `<h2>Welcome to arthuranteater, ${data[0].Name}!</h2>` + welcome.html + `<h4>Subscriber ID: ${data[0].Passcode}</h4>`
    sgMail.send(welcome, (err, res) => {
      if (err) {
        console.error(err.toString())
        console.log(res)
      }
      else {
        console.log("sent")
      }
    })
  })
});

//to delete subscriber

app.delete("/:code", (req, res) => {
  queries.deleteSubscriber(req.params.code).then(data => res.json({ data }));
});

//to add new blog post

app.post("/posts/", (req, res, nxt) => {
  queries.addPost(req.body).then(data => {
    res.json({ data })
    let cat = data[0].Category
    queries.getByCat(cat).then(data => {
      let elist = []
      data.map(subs => {
        elist.push(`${subs.Name} <${subs.Email}>`)
      })
      console.log("elist", elist)
      const post = {
        to: elist,
        from: ' <someone@example.org>',
        subject: 'New Blog Post',
        text: 'new blog post',
        html: `<div><h2>Raspberry Pi GPS</h2><p><strong>step-by-step guide to building</strong></p><h2>How to Redux</h2><p><strong>setting up store</strong></p></div>`,
      }
      sgMail.sendMultiple(post, (err, res) => {
        if (err) {
          console.error(err.toString())
          console.log(res)
        }
        else {
          console.log("sent")
        }
      })
    })
  })
})