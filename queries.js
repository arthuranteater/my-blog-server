let connection = require('./knexfile')[process.env.DATABASE_URL || 'development']
let knex = require('knex')(connection)


module.exports = {
    list() {
        return knex("subscribers");
    },
    getByCat(cat) {
        return knex
            .select()
            .from("subscribers")
            .where("category", cat);
    },
    createSubscriber(subscriber) {
        return knex("subscribers").insert(subscriber, ["Name", "Email", "Passcode"]);
    },
    deleteSubscriber(code) {
        return knex
            .select()
            .from("subscribers")
            .where("Passcode", code)
            .del()
            .returning("*");
    },
    updateSubscriber(id, body) {
        return knex
            .select()
            .from("subscribers")
            .where("id", id)
            .update(body)
            .returning("*");
    }
};