exports.up = knex => knex.schema.createTable("movies_tags", table => {
    table.increments("id")
    table.text("name").notNullable()
    table.integer("note_id").references("id").inTable("movies_notes").onDelete("CASCADE")
    table.integer("user_id").references("id").inTable("users")
    table.text("title")
})

exports.down = knex => knex.schema.dropTable("movies_tags")
