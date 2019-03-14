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
app.use(function (err, req, res, next) {
  console.log('err', err.message)
  res.status(404).json(err)
})


app.listen(port, (req, res) => {
  console.log(`listening on ${port}`);
});

//to list all subs

app.post(`/${process.env.ALLSUB}/`, (req, res) => {
  res.status(200)
  queries.listSubs().then(data => {
    res.json({ data })
  })
})

//to list all posts

app.post(`/${process.env.ALLPOST}/`, (req, res) => {
  res.status(200)
  queries.listPosts().then(data => {
    res.json({ data })
  })
})

//to create new sub

app.post(`/${process.env.ADDSUB}/`, (req, res, next) => {
  res.status(200)
  console.log('subscriber received')
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
    <h3><a href=http://localhost:8000${slug}>${title}</a></h3><h4>${subTitle}</h4>
    <div><a href="https://huntcodes.co/#contact" target="_blank">Contact Us</a><span> | </span><a href="https://arthuranteater.com/unsubscribe" target="_blank">Unsubscribe</a></div>
    <h4>Subscriber ID: ${pass}</h4>`,
  }
  sgMail.send(welcome, (err, res) => {
    if (err) {
      console.error('Send Grid Error:', err.toString())
    }
    else {
      console.log(`sent welcome email ${welcome.to.email}`)
    }
  })
  delete req.body.post
  queries.addSub(req.body).then(data => {
    res.json({ Response: 'subscriber added' })
    console.log('subscriber added')
  }).catch(err => {
    console.error('Query Error:', err)
    res.status(200).json({ Response: 'query error' })
  })
})

//to delete subscriber

app.post(`/${process.env.DELSUB}/`, (req, res, next) => {
  res.status(200)
  console.log('body', req.body)
  queries.delSub(req.body.Email).then(data => {
    if (data.length == 0) {
      console.error('No matches')
      res.json({ Response: 'No matches!' })
    } else {
      res.json({ Response: 'subscriber removed' })
      console.log('subscriber removed')
      let email = data[0].Email
      let name = data[0].Name
      const unsubscribe = {
        to: {
          name: name,
          email: email,
        },
        from: {
          name: 'arthuranteater',
          email: 'no-reply@huntcodes.com'
        },
        subject: `You've been unsubscribed, ${name}`,
        text: 'Unsubscribe notice',
        html: `<h2>You've been unsubscribed from arthuranteater, ${name}</h2><h3><strong>If this was a mistake please click the link below to re-subscribe.</strong></h3>
    <div><a href="https://huntcodes.co/#contact" target="_blank">Contact Us</a><span> | </span><a href="https://arthuranteater.com/subscribe" target="_blank">Subscribe</a></div>
   `,
      }
      sgMail.send(unsubscribe, (err, res) => {
        if (err) {
          console.error('Send Grid Error', err.toString())
        }
        else {
          console.log(`sent unsubscribe email to ${unsubscribe.to.email}`)
        }
      })
    }
  }).catch(err => {
    console.log('Query Error:', err)
    res.json({ Response: 'query error' })
  })
})

//to add new blog post

app.post(`/${process.env.ADDPOST}/`, (req, res, nxt) => {
  res.status(200)
  queries.findPost(req.body.PDate).then(data => {
    console.log('npost received')
    let title = req.body.Title
    if (data.length == 0) {
      console.log(`adding ${title}`)
      queries.addPost(req.body).then(data => {
        res.json({ Response: 'post received' })
        let cat = data[0].Category
        let title = data[0].Title
        let subTitle = data[0].Subtitle
        let slug = data[0].Slug
        queries.getByCat(cat).then(data => {
          let elist = []
          data.map(sub => {
            elist.push(`${sub.Name} <${sub.Email}>`)
          })
          const post = {
            to: elist,
            from: 'arthuranteater <no-reply@huntcodes.co>',
            subject: `New ${cat} Post!`,
            text: `new ${cat} post`,
            html: `<div><h2><a href=http://localhost:8000/subscribe${slug}>${title}</a></h2><h3>${subTitle}</h3></div><div><a href="https://huntcodes.co/#contact" target="_blank">Contact Us</a>
            <span> | </span><a href="https://arthuranteater.com/unsubscribe" target="_blank">Unsubscribe</a></div>`,
          }
          sgMail.sendMultiple(post, (err, res) => {
            if (err) {
              console.error('Send Grid Error', err.toString())
            }
            else {
              console.log(`sent npost to ${post.to}`)
            }
          })
        })
      }).catch(err => {
        console.error('Query Error:', err)
        res.json({ Response: 'query error' })
      })
    } else {
      console.log(`already added ${title}`)
    }
  }).catch(err => {
    console.error('Query Error:', err)
    res.json({ Response: 'query error' })
  })
})