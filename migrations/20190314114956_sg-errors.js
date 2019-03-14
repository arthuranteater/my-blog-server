
exports.up = function (knex, Promise) {
    return knex.schema.createTable("sg-errors", error => {
        error.increments("Id")
        error.text("Message")
        error.text("Type")
        error.text("EDate")
        error.text("Email")
        error.text("Name")
    })

};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists("sg-errors")
};
