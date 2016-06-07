
exports.up = function(knex, Promise) {
    return Promise.all([

        // USER
        knex.schema.createTable("user", function(table) {
            table.increments("id").primary();
            table.string("name").notNullable();
            table.string("email").notNullable();
            table.string("facebook_id").nullable();
            table.string("facebook_token").nullable();
            table.timestamp("created_dtm").defaultTo(knex.raw('NOW()')).notNullable();
            table.timestamp("last_updated_dtm").defaultTo(knex.raw('NOW()')).notNullable();
        }),

        // LEAGUE
        knex.schema.createTable("league", function(table) {
            table.increments("id").primary();
            table.string("name").notNullable();
            table.string("access_code").notNullable();
            table.boolean("is_deleted").defaultTo(false).notNullable();
            table.integer("created_by_user_id").unsigned().notNullable();
            table.timestamp("created_dtm").defaultTo(knex.raw('NOW()')).notNullable();
            table.timestamp("last_updated_dtm").defaultTo(knex.raw('NOW()')).notNullable();
        }),

        // LEAGUE USER
        knex.schema.createTable("league_user", function(table) {
            table.increments("id").primary();
            table.integer("league_id").unsigned().notNullable().references("league.id");
            table.integer("user_id").unsigned().notNullable().references("user.id");
            table.boolean("is_admin").defaultTo(false).notNullable();
            table.boolean("is_active").defaultTo(true).notNullable();
            table.boolean("is_deleted").defaultTo(false).notNullable();
            table.timestamp("created_dtm").defaultTo(knex.raw('NOW()')).notNullable();
            table.timestamp("last_updated_dtm").defaultTo(knex.raw('NOW()')).notNullable();
        }),

        // SEASON
        knex.schema.createTable("season", function(table) {
            table.increments("id").primary();
            table.integer("league_id").unsigned().notNullable().references("league.id");
            table.integer("year").notNullable();
            table.boolean("is_active").notNullable();
            table.boolean("is_deleted").defaultTo(false).notNullable();
            table.integer("first_place_user_id").unsigned().nullable().references("user.id");
            table.decimal("first_place_winnings", 7, 2).nullable();
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
            table.decimal("amount", 7, 2).notNullable();
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
        knex.schema.dropTable("league_user"),
        knex.schema.dropTable("league"),
        knex.schema.dropTable("user")
    ]);
};
