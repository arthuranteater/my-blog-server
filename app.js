// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs



require('dotenv').config()

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
emailarr = ['huntapplegate@gmail.com', 'hunt@huntcodes.co']
const msg = {
    to: emailarr,
    from: 'test@example.com',
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<div><h2>Paragraph 1</h2><p><strong>and easy to do anywhere, even with Node.js</strong></p><h2>Paragraph 2</h2><p><strong>and easy to do anywhere, even with Node.js</strong></p></div>',
};


//msg.to = ['huntapplegate@gmail.com', 'hunt@huntcodes.co']

console.log('msg', msg)
sgMail.sendMultiple(msg);