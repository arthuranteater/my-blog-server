let connection = require('./knexfile')[process.env.NODE_ENV || 'development']
let knex = require('knex')(connection)


module.exports = {
    listSubs() {
        return knex("subscribers")
    },
    listPosts() {
        return knex("posts")
    },
    listErrs() {
        return knex("sg-errors")
    },
    getErrsByEmail(email) {
        return knex
            .select()
            .from("sg-errors")
            .where('Email', email)
    },
    addErr(err) {
        return knex("sg-errors").insert(err, ["Message", "Type", "EDate", "Email", "Name"])
    },
    getSubsByCat(cat) {
        return knex
            .select()
            .from("subscribers")
            .where('Categories', 'like', `%${cat}%`)
            .orWhere('Categories', 'like', '%All%')
    },
    findSub(email) {
        return knex
            .select()
            .from("subscribers")
            .where("Email", email)
    },
    addSub(sub) {
        return knex("subscribers").insert(sub, ["Name", "Email", "Categories", "Passcode"])
    },
    addPost(post) {
        return knex("posts").insert(post, ["Title", "Subtitle", "Category", "Slug", "PDate"])
    },
    findPost(date) {
        return knex
            .select()
            .from("posts")
            .where("PDate", date)
    },
    delSub(email) {
        return knex
            .select()
            .from("subscribers")
            .where("Email", email)
            .del()
            .returning("*");
    }
};