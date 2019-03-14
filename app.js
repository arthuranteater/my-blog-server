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

//today's date

let today = new Date

const getDate = () => {
  let dd = today.getDate();
  let mm = today.getMonth() + 1
  const yyyy = today.getFullYear()
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  today = yyyy + '-' + mm + '-' + dd
}


app.listen(port, (req, res) => {
  console.log(`listening on ${port}`);
})

//all subs

app.get(`/${process.env.ALLSUB}/`, (req, res) => {
  res.status(200)
  console.log('all subs req')
  queries.listSubs().then(data => {
    res.json({ data })
    console.log('sent all subs')
  })
})

//subs by cat

app.get(`/${process.env.GETSUB}/:id`, (req, res) => {
  res.status(200)
  console.log('subs by cat req')
  queries.getByCat(req.params.id).then(data => {
    res.json({ data })
    console.log('sent subs by cat')
  })
})

//all posts

app.get(`/${process.env.ALLPOST}/`, (req, res) => {
  res.status(200)
  console.log('all posts req')
  queries.listPosts().then(data => {
    res.json({ data })
    console.log('sent all posts')
  })
})

//all errs

app.get(`/${process.env.ALLERR}/`, (req, res) => {
  res.status(200)
  console.log('all errs req')
  queries.listErrs().then(data => {
    res.json({ data })
    console.log('sent all errs')
  })
})

//errs by email

app.get(`/${process.env.GETERRS}/:id`, (req, res) => {
  res.status(200)
  console.log('errs by email req')
  let email = req.params.id
  queries.getErrsByEmail(email).then(data => {
    res.json({ data })
    console.log('sent errs by email')
  })
})


//welcome email

app.post(`/${process.env.WELCOME}/`, (req, res, next) => {
  res.status(200)
  console.log('welcome email req')
  getDate()
  let edate = today
  let type = 'welcome'
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
  sgMail.send(welcome, (err, sgres) => {
    if (err) {
      let mes = err.toString()
      res.json({ Response: `Send Grid Error: ${mes}` })
      console.error('Send Grid Error:', mes)
      console.log(`Send Grid Response: ${sgres}`)
      let epkg = {
        Email: email, Name: name, Message: mes, Type: type, EDate: edate
      }
      queries.addErr(epkg).then(data => {
        console.log('error added to log')
      }).catch(err => {
        console.error('addErr err:', err)
      })
    }
    else {
      res.json({ Response: `Email sent to ${email}` })
      console.log(`sent welcome email ${email}`)
    }
  })
})

//add sub

app.post(`/${process.env.ADDSUB}/`, (req, res, next) => {
  res.status(200)
  console.log('add subscriber req')
  let sub = req.body
  let email = sub.Email
  queries.findSub(email).then(data => {
    if (data.length == 0) {
      queries.addSub(sub).then(data => {
        res.json({ Response: 'Subscriber added' })
        console.log('subscriber added')
      }).catch(err => {
        res.json({ Response: 'Query error' })
        console.error('Query Error:', err)
      })
    } else {
      res.json({ Response: 'Email already added' })
      console.log('email already added')
    }
  }).catch(err => {
    res.json({ Response: 'Query error' })
    console.error('Query Error:', err)
  })
})



//new sub

// app.post(`/${process.env.NEWSUB}/`, (req, res, next) => {
//   res.status(200)
//   console.log('subscriber received')
//   let title = req.body.post.title
//   let subTitle = req.body.post.subTitle
//   let slug = req.body.post.slug
//   let name = req.body.Name
//   let pass = req.body.Passcode
//   let cats = req.body.Categories
//   let email = req.body.Email
//   const welcome = {
//     to: {
//       name: name,
//       email: email,
//     },
//     from: {
//       name: 'arthuranteater',
//       email: 'no-reply@huntcodes.com'
//     },
//     subject: `Thanks for subscribing, ${name}`,
//     text: 'Welcome to arthuranteater!',
//     html: `<h2>Welcome to arthuranteater, ${name}!</h2><h3><strong>Sharing projects, coding challenges, new tech, and best practices</strong></h3>
//   <p><strong>You are set up to receive alerts for the catergories: ${cats}. If our emails go to spam, try adding us to your contacts.</strong></p>
//   <h3><a href=http://localhost:8000${slug}>${title}</a></h3><h4>${subTitle}</h4>
//   <div><a href="https://huntcodes.co/#contact" target="_blank">Contact Us</a><span> | </span><a href="https://arthuranteater.com/unsubscribe" target="_blank">Unsubscribe</a></div>
//   <h4>Subscriber ID: ${pass}</h4>`,
//   }
//   sgMail.send(welcome, (err, sgres) => {
//     if (err) {
//       console.error('Send Grid Error:', err.toString())
//     }
//     else {
//       console.log(`sent welcome email ${welcome.to.email}`)
//     }
//   })
//   delete req.body.post
//   queries.addSub(req.body).then(data => {
//     res.json({ Response: 'subscriber added' })
//     console.log('subscriber added')
//   }).catch(err => {
//     console.error('Query Error:', err)
//     res.status(200).json({ Response: 'query error' })
//   })
// })

//delete subscriber

app.post(`/${process.env.DELSUB}/`, (req, res, next) => {
  res.status(200)
  console.log('body', req.body)
  getDate()
  let edate = today
  let type = 'unsubscribe'
  let email = req.body.Email
  queries.delSub(email).then(data => {
    if (data.length == 0) {
      console.error('No matches')
      res.json({ Response: 'No matches!' })
    } else {
      res.json({ Response: 'subscriber removed' })
      console.log('subscriber removed')
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
          let mes = err.toString()
          res.json({ Response: `Send Grid Error: ${mes}` })
          console.error('Send Grid:', mes)
          console.log(`Send Grid Response: ${sgres}`)
          let epkg = {
            Email: email, Name: name, Message: mes, Type: type, EDate: edate
          }
          queries.addErr(epkg).then(data => {
            console.log('err added to db')
          }).catch(err => {
            console.error('addErr:', err)
          })
        }
        else {
          console.log(`sent unsubscribe email to ${unsubscribe.to.email}`)
        }
      })
    }
  }).catch(err => {
    console.error('delSub:', err)
    res.json({ Response: 'Query error' })
  })
})

//new blog post

app.post(`/${process.env.ADDPOST}/`, (req, res, nxt) => {
  res.status(200)
  console.log('new post req')
  getDate()
  let edate = today
  let type = 'post'
  let post = req.body
  let title = post.Title
  let date = post.PDate
  let cat = post.Category
  let subTitle = post.SubTitle
  let slug = post.Slug
  queries.findPost(date).then(data => {
    console.log('npost received')
    if (data.length == 0) {
      console.log(`adding ${title}`)
      queries.addPost(post).then(data => {
        res.json({ Response: 'post received' })
        // let cat = data[0].Category
        // let title = data[0].Title
        // let subTitle = data[0].Subtitle
        // let slug = data[0].Slug
        queries.getSubsByCat(cat).then(data => {
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
          sgMail.sendMultiple(post, (err, sgres) => {
            if (err) {
              let mes = err.toString()
              console.error('Send Grid:', mes)
              console.log(`Send Grid Response: ${sgres}`)
              let epkg = {
                Email: email, Name: name, Message: mes, Type: type, EDate: edate
              }
              queries.addErr(epkg).then(data => {
                console.log('err added to db')
              }).catch(err => {
                console.error('addErr:', err)
              })
            }
            else {
              console.log(`sent npost to ${post.to}`)
            }
          })
        }).catch(err => {
          console.error('getSubsByCat:', err)
          res.json({ Response: 'Query error' })
        })
      }).catch(err => {
        console.error('addPost:', err)
        res.json({ Response: 'Query error' })
      })
    } else {
      console.log(`already added ${title}`)
    }
  }).catch(err => {
    console.error('findPost:', err)
    res.json({ Response: 'Query error' })
  })
})