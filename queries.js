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
    addSubscriber(sub) {
        return knex("subscribers").insert(sub, ["Name", "Email", "Categories", "Passcode"]);
    },
    addPost(post) {
        return knex("posts").insert(post, ["Title", "Subtitle", "Category", "Slug"])
    },
    deleteSubscriber(email, code) {
        return knex
            .select()
            .from("subscribers")
            .where("Passcode", code)
            .andWhere("Email", email)
            .del()
            .returning("*");
    }
};