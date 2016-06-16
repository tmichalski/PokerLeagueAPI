
exports.up = function(knex, Promise) {
    return Promise.all([

        // USER
        knex.schema.createTable("user", function(table) {
            table.increments("id").primary();
            table.string("name").notNullable();
            table.string("email").notNullable();
            table.string("facebookId").nullable();
            table.string("facebookToken").nullable();
            table.timestamp("createdDtm").defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable();
            table.timestamp("lastUpdatedDtm").defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')).notNullable();
        }),

        // LEAGUE
        knex.schema.createTable("league", function(table) {
            table.increments("id").primary();
            table.string("name").notNullable();
            table.string("accessCode").notNullable();
            table.boolean("isDeleted").defaultTo(false).notNullable();
            table.integer("createdByUserId").unsigned().notNullable();
            table.timestamp("createdDtm").defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable();
            table.timestamp("lastUpdatedDtm").defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')).notNullable();
        }),

        // LEAGUE USER
        knex.schema.createTable("leagueUser", function(table) {
            table.increments("id").primary();
            table.integer("leagueId").unsigned().notNullable().references("league.id");
            table.integer("userId").unsigned().notNullable().references("user.id");
            table.boolean("isAdmin").defaultTo(false).notNullable();
            table.boolean("isActive").defaultTo(true).notNullable();
            table.boolean("isDeleted").defaultTo(false).notNullable();
            table.timestamp("createdDtm").defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable();
            table.timestamp("lastUpdatedDtm").defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')).notNullable();
        }),

        // SEASON
        knex.schema.createTable("season", function(table) {
            table.increments("id").primary();
            table.integer("leagueId").unsigned().notNullable().references("league.id");
            table.integer("year").notNullable();
            table.boolean("isActive").notNullable();
            table.boolean("isDeleted").defaultTo(false).notNullable();
            table.integer("firstPlaceUserId").unsigned().nullable().references("user.id");
            table.decimal("firstPlaceWinnings", 7, 2).nullable();
            table.timestamp("createdDtm").defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable();
            table.timestamp("lastUpdatedDtm").defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')).notNullable();
        }),

        // EVENT
        knex.schema.createTable("event", function(table) {
            table.increments("id").primary();
            table.integer("seasonId").unsigned().notNullable().references("season.id");
            table.integer("hostUserId").unsigned().notNullable().references("user.id");
            table.string("name").nullable();
            table.date("eventDate").notNullable();
            table.timestamp("createdDtm").defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable();
            table.timestamp("lastUpdatedDtm").defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')).notNullable();
        }),

        // EVENT USER
        knex.schema.createTable("eventUser", function(table) {
            table.increments("id").primary();
            table.integer("eventId").unsigned().notNullable().references("event.id");
            table.integer("userId").unsigned().notNullable().references("user.id");
            table.timestamp("createdDtm").defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable();
            table.timestamp("lastUpdatedDtm").defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')).notNullable();
        }),

        // EVENT ACTIVITY TYPE
        knex.schema.createTable("eventActivityType", function(table) {
            table.increments("id").primary();
            table.string("name").notNullable();
        }),

        // EVENT ACTIVITY
        knex.schema.createTable("eventActivity", function(table) {
            table.increments("id").primary();
            table.integer("eventId").unsigned().notNullable().references("event.id");
            table.integer("userId").unsigned().notNullable().references("user.id");
            table.integer("eventActivityTypeId").unsigned().notNullable().references("eventActivityType.id");
            table.string("note", 300);
            table.decimal("amount", 7, 2).nullable();
            table.timestamp("createdDtm").defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable();
            table.timestamp("lastUpdatedDtm").defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')).notNullable();
        })
    ]);

};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable("eventActivity"),
        knex.schema.dropTable("eventActivityType"),
        knex.schema.dropTable("eventUser"),
        knex.schema.dropTable("event"),
        knex.schema.dropTable("season"),
        knex.schema.dropTable("leagueUser"),
        knex.schema.dropTable("league"),
        knex.schema.dropTable("user")
    ]);
};
