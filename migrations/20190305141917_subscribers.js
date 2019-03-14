
exports.up = function (knex, Promise) {
    return knex.schema.createTable("subscribers", subscriber => {
        subscriber.increments("Id")
        subscriber.text("Name")
        subscriber.text("Email")
        subscriber.text("Categories")
        subscriber.text("Passcode")
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists("subscribers")
};

