
exports.up = function(knex, Promise) {
    return Promise.all([

        // USER
        knex.schema.createTable("user", function(table) {
            table.increments("id").primary();
            table.string("nickname").notNullable();
            table.string("full_name").notNullable();
            table.boolean("is_visitor").notNullable();
            table.timestamp("created_dtm").defaultTo(knex.raw('NOW()')).notNullable();
            table.timestamp("last_updated_dtm").defaultTo(knex.raw('NOW()')).notNullable();
        }),

        // SEASON
        knex.schema.createTable("season", function(table) {
            table.increments("id").primary();
            table.integer("year").notNullable();
            table.boolean("is_active").notNullable();
            table.integer("winner_user_id").unsigned().nullable().references("user.id");
            table.timestamp("created_dtm").defaultTo(knex.raw('NOW()')).notNullable();
            table.timestamp("last_updated_dtm").defaultTo(knex.raw('NOW()')).notNullable();
        }),

        // EVENT
        knex.schema.createTable("event", function(table) {
            table.increments("id").primary();
            table.integer("season_id").unsigned().notNullable().references("season.id");
            table.integer("host_user_id").unsigned().notNullable().references("user.id");
            table.string("name").nullable();
            table.date("event_date").notNullable();
            table.timestamp("created_dtm").defaultTo(knex.raw('NOW()')).notNullable();
            table.timestamp("last_updated_dtm").defaultTo(knex.raw('NOW()')).notNullable();
        }),

        // EVENT RESULT
        knex.schema.createTable("event_result", function(table) {
            table.increments("id").primary();
            table.integer("event_id").unsigned().notNullable().references("event.id");
            table.integer("user_id").unsigned().notNullable().references("user.id");
            table.decimal("amount", 5, 2).notNullable();
            table.timestamp("created_dtm").defaultTo(knex.raw('NOW()')).notNullable();
            table.timestamp("last_updated_dtm").defaultTo(knex.raw('NOW()')).notNullable();
        }),

        // EVENT NOTE
        knex.schema.createTable("event_note", function(table) {
            table.increments("id").primary();
            table.integer("event_id").unsigned().notNullable().references("event.id");
            table.integer("user_id").unsigned().notNullable().references("user.id");
            table.string("note", 300);
            table.timestamp("created_dtm").defaultTo(knex.raw('NOW()')).notNullable();
            table.timestamp("last_updated_dtm").defaultTo(knex.raw('NOW()')).notNullable();
        })
    ]);

};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable("event_result"),
        knex.schema.dropTable("event_note"),
        knex.schema.dropTable("event"),
        knex.schema.dropTable("season"),
        knex.schema.dropTable("user")
    ]);
};
