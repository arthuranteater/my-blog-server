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
sgMail.setApiKey(process.env.SGKEY)
app.use(bodyParser.json())
app.use(cors())


//testing variables

// const name = 'Hunt'
// const email = 'hunt@huntcodes.co'
// const tester2 = ['huntapplegate@gmail.com', 'hunt@huntcodes.co']

app.listen(port, (req, res) => {
  console.log(`listening on ${port}`);
});

//to list all subs

app.post(`/${process.env.ALLSUB}/`, (req, res) => {
  queries.listSubs().then(data => {
    res.json({ data })
  })
})

//to list all posts

app.post(`/${process.env.ALLPOST}/`, (req, res) => {
  queries.listPosts().then(data => {
    res.json({ data })
  })
})

//to create new sub

app.post(`/${process.env.ADDSUB}/`, (req, res) => {
  let title = req.body.post.title
  let subTitle = req.body.post.subTitle
  let slug = req.body.post.slug
  let name = req.body.Name
  let pass = req.body.Passcode
  let cats = req.body.Categories
  let email = req.body.Email
  const welcome = {
    to: {
      name: name,
      email: email,
    },
    from: {
      name: 'arthuranteater',
      email: 'no-reply@huntcodes.com'
    },
    subject: `Thanks for subscribing, ${name}`,
    text: 'Welcome to arthuranteater!',
    html: `<h2>Welcome to arthuranteater, ${name}!</h2><h3><strong>Sharing projects, coding challenges, new tech, and best practices</strong></h3>
    <p><strong>You are set up to receive alerts for the catergories: ${cats}. If our emails go to spam, try adding us to your contacts.</strong></p>
    <h3><a href=http://localhost:8000/subscribe${slug}>${title}</a></h3><h4>${subTitle}</h4>
    <a href="https://huntcodes.co/#contact" target="_blank">Contact Us</a>
    <a href="https://arthuranteater.com/unsubscribe" target="_blank">Unsubscribe</a></div>
    <h4>Subscriber ID: ${pass}</h4>`,
  }
  sgMail.send(welcome, (err, res) => {
    if (err) {
      console.error(err.toString())
      console.log(res)
    }
    else {
      console.log("sent welcome email")
    }
  })
  delete req.body.post
  queries.addSubscriber(req.body).then(() => {
    console.log('added subscriber')
    res.status(200).send('pkg received')
  }).catch(() => {
    console.log('no subscriber added')
    res.status(400).send('pkg not received')
  })
})

//to delete subscriber

app.post(`/${process.env.DELSUB}/`, (req, res) => {
  queries.deleteSubscriber(req.body.Email, req.body.Passcode).then(data => res.json({ data }));
});

//to add new blog post

app.post(`/${process.env.ADDPOST}/`, (req, res, nxt) => {
  queries.addPost(req.body).then(data => {
    res.json({ data })
    let cat = data[0].Category
    queries.getByCat(cat).then(data => {
      let elist = []
      data.map(sub => {
        elist.push(`${sub.Name} <${sub.Email}>`)
      })
      const post = {
        to: elist,
        from: 'arthuranteater <no-reply@huntcodes.co>',
        subject: 'New Blog Post',
        text: 'new blog post',
        html: `<div><h2>Raspberry Pi GPS</h2><p><strong>step-by-step guide to building</strong></p><h2>How to Redux</h2><p><strong>setting up store</strong></p></div>`,
      }
      console.log('to', post.to)
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