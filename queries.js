let connection = require('./knexfile')[process.env.DATABASE_URL || 'development']
let knex = require('knex')(connection)


module.exports = {
    listSubs() {
        return knex("subscribers");
    },
    listPosts() {
        return knex("posts");
    },
    getByCat(cat) {
        return knex
            .select()
            .from("subscribers")
            .where('Categories', 'like', `%${cat}%`)
    },
    addSubscriber(subscriber) {
        return knex("subscribers").insert(subscriber, ["Name", "Email", "Categories", "Passcode"]);
    },
    addPost(post) {
        return knex("posts").insert(post, ["Title", "Subtitle", "Category", "Slug"])
    },
    deleteSubscriber(code) {
        return knex
            .select()
            .from("subscribers")
            .where("Passcode", code)
            .del()
            .returning("*");
    }
};