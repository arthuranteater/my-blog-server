const Email = require('./Main')


class Post extends Email {
    constructor(name, email, pass, cats, logo) {
        super(name, email, pass)
        this.cats = cats
        this.logo = logo
    }
    test() {
        console.log(this.name + this.email + ' blah.')
        console.log('still', this.still)
        console.log('cats', this.cats)
    }
    create() {
        return {
            to: { name: this.name, email: this.email }, from: this.from, subject: `Welcome to arthuranteater, ${this.name}`,
            text: 'Welcome to arthuranteater!',
            html: `<img src="cid:logo" width="80" height="80"><h2>Welcome to arthuranteater, ${this.name}!</h2><h3><strong>Sharing projects, coding challenges, new tech, and best practices</strong></h3>
      <p><strong>You have selected to receive alerts for the categories: ${this.cats}. If our email went into to spam, please mark it as not spam and add us to your contacts.</strong></p>
      <p><strong>Copy the Subscriber ID and paste into the <a href="https://arthuranteater.com/subscribe" target="_blank">subscribe page</a>.</strong></p>
      <h2><strong>Subscriber ID: ${this.pass}</strong></h2>
      <div><a href="https://huntcodes.co/#contact" target="_blank">Contact Us</a><span></div>`,
            attachments: [
                {
                    content: this.logo,
                    filename: 'logo.png',
                    type: 'image/png',
                    disposition: 'inline',
                    content_id: 'logo'
                },
            ]
        }
    }
}



module.exports = Post

