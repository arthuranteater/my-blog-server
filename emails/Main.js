class Email {
    constructor(name, email, pass) {
        this.name = name
        this.email = email
        this.pass = pass
        this.still = 'nochange'
        this.from = {
            name: 'arthuranteater',
            email: 'no-reply@huntcodes.co'
        }
    }

    test() {
        console.log(this.name + ' makes a noise.')
    }

}



module.exports = Email