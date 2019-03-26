const sgMail = require('@sendgrid/mail')
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const dotenv = require('dotenv')
const rateLimit = require("express-rate-limit")
const port = process.env.PORT || 5000
const queries = require("./queries")

dotenv.config()
sgMail.setApiKey(process.env.SGKEY)

app.use(bodyParser.json())
app.use(cors())

//limiter

app.enable("trust proxy")

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 4,
  handler: function (req, res, nxt) {
    res.status(200).json({ Response: 'Too many requests, try again later' })
    console.log('hit req limit')
  }
})



app.listen(port, (req, res) => {
  console.log(`listening on ${port}`);
})

//base64 encoder

// var fs = require('fs')

// var imageAsBase64 = fs.readFileSync('./your-image.png', 'base64')

// fs.readFileSync(path[, options])

// Synchronous version of fs.readFile(). Returns the contents of the path.

// If the encoding option is specified then this function returns a string. Otherwise it returns a buffer.

//logo src

const logo = {
  base64: "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"
}

//today's date

let today

const getDate = () => {
  today = new Date
  let dd = today.getDate()
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

//all subs

app.get(`/${process.env.ALLSUB}/`, (req, res) => {
  res.status(200)
  console.log('received all subs req')
  queries.listSubs().then(data => {
    res.json({ data })
    console.log('sent all subs')
  })
})

//subs by cat

app.get(`/${process.env.GETSUB}/:id`, (req, res) => {
  res.status(200)
  console.log('received subs by cat req')
  queries.getByCat(req.params.id).then(data => {
    res.json({ data })
    console.log('sent subs by cat')
  })
})

//all posts

app.get(`/${process.env.ALLPOST}/`, (req, res) => {
  res.status(200)
  console.log('received all posts req')
  queries.listPosts().then(data => {
    res.json({ data })
    console.log('sent all posts')
  })
})

//all errs

app.get(`/${process.env.ALLERR}/`, (req, res) => {
  res.status(200)
  console.log('received all errs req')
  queries.listErrs().then(data => {
    res.json({ data })
    console.log('sent all errs')
  })
})

//errs by email

app.get(`/${process.env.GETERRS}/:id`, (req, res) => {
  res.status(200)
  console.log('received errs by email req')
  let email = req.params.id
  queries.getErrsByEmail(email).then(data => {
    res.json({ data })
    console.log('sent errs by email')
  })
})


//welcome email

app.post(`/${process.env.WELCOME}/`, limiter, (req, res, next) => {
  console.log('received welcome email req')
  getDate()
  let type = 'welcome'
  let sub = req.body
  let name = sub.Name
  let pass = sub.Passcode
  let cats = sub.Categories
  let email = sub.Email
  const welcome = {
    to: {
      name: name,
      email: email,
    },
    from: {
      name: 'arthuranteater',
      email: 'no-reply@huntcodes.co'
    },
    subject: `Welcome to arthuranteater, ${name}`,
    text: 'Welcome to arthuranteater!',
    html: `<img src="cid:logo" width="80" height="80"><h2>Welcome to arthuranteater, ${name}!</h2><h3><strong>Sharing projects, coding challenges, new tech, and best practices</strong></h3>
    <p><strong>You have selected to receive alerts for the categories: ${cats}. If our email went into to spam, please mark it as not spam and add us to your contacts.</strong></p>
    <p><strong>Copy the Subscriber ID and paste into Step 2 on the subscribe page.</strong></p>
    <h2><strong>Subscriber ID: ${pass}</strong></h2>
    <div><a href="https://huntcodes.co/#contact" target="_blank">Contact Us</a><span></div>`,
    attachments: [
      {
        content: logo.base64,
        filename: 'logo.png',
        type: 'image/png',
        disposition: 'inline',
        content_id: 'logo'
      },
    ]
  }
  sgMail.send(welcome, (err, sgres) => {
    if (err) {
      let mes = err.toString()
      res.json({ Response: `Send Grid Error: ${mes}` })
      console.error('Send Grid Error:', mes)
      console.log(`Send Grid Response: ${sgres}`)
      let epkg = {
        Email: email, Name: name, Message: mes, Type: type, EDate: today
      }
      queries.addErr(epkg).then(data => {
        console.log('error added to log')
      }).catch(err => {
        console.error('addErr err:', err)
      })
    }
    else {
      res.json({ Response: email })
      console.log(`sent welcome email to ${email}`)
    }
  })
})

//add sub

app.post(`/${process.env.ADDSUB}/`, limiter, (req, res, next) => {
  res.status(200)
  console.log('received add subscriber req')
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

//delete sub

app.post(`/${process.env.DELSUB}/`, limiter, (req, res, next) => {
  res.status(200)
  console.log('received delete sub req')
  getDate()
  let type = 'unsubscribe'
  let email = req.body.email
  queries.delSub(email).then(data => {
    if (data.length == 0) {
      console.error('No matches')
      res.json({ Response: 'No matches' })
    } else {
      res.json({ Response: 'Subscriber removed' })
      console.log('subscriber removed')
      let name = data[0].Name
      const unsubscribe = {
        to: {
          name: name,
          email: email,
        },
        from: {
          name: 'arthuranteater',
          email: 'no-reply@huntcodes.co'
        },
        subject: `You've been unsubscribed, ${name}`,
        text: 'Unsubscribe notice',
        html: `<img src="cid:logo" width="80" height="80"><h2>${email} has been removed from the arthuranteater mailing list.</h2><h3><strong>If this was a mistake, please click the link below to re-subscribe.</strong></h3>
    <div><a href="https://huntcodes.co/#contact" target="_blank">Contact Us</a><span> | </span><a href="https://arthuranteater.com/subscribe" target="_blank">Subscribe</a></div>
   `,
        attachments: [
          {
            content: logo.base64,
            filename: 'logo.png',
            type: 'image/png',
            disposition: 'inline',
            content_id: 'logo'
          },
        ]
      }
      sgMail.send(unsubscribe, (err, res) => {
        if (err) {
          let mes = err.toString()
          console.error('Send Grid:', mes)
          console.log(`Send Grid Response: ${sgres}`)
          let epkg = {
            Email: email, Name: name, Message: mes, Type: type, EDate: today
          }
          queries.addErr(epkg).then(data => {
            console.log('err added to db')
          }).catch(err => {
            console.error('addErr:', err)
          })
        }
        else {
          console.log(`sent unsubscribe email to ${email}`)
        }
      })
    }
  }).catch(err => {
    console.error('delSub:', err)
    res.json({ Response: 'Query error' })
  })
})

//new post

app.post(`/${process.env.ADDPOST}/`, (req, res, nxt) => {
  res.status(200)
  console.log('received new post req')
  getDate()
  let type = 'post'
  let post = req.body
  let title = post.Title
  let date = post.PDate
  let cat = post.Category
  let subTitle = post.SubTitle
  let slug = post.Slug
  queries.findPost(date).then(data => {
    console.log('post received')
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
                Email: email, Name: name, Message: mes, Type: type, EDate: today
              }
              queries.addErr(epkg).then(data => {
                console.log('err added to db')
              }).catch(err => {
                console.error('addErr:', err)
              })
            }
            else {
              console.log(`sent new post to ${post.to}`)
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