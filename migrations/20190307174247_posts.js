
exports.up = function (knex, Promise) {
    return knex.schema.createTable("posts", post => {
        post.increments("Id")
        post.text("Title")
        post.text("Subtitle")
        post.text("Category")
        post.text("Slug")
        post.text("PDate")
    })

};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists("posts")
}
