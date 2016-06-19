const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile');
const knex = require('knex')(config[env]);

// EXPORT
module.exports = knex;

// MIGRATE
const migrateConfig = {directory: './db/migrations'};
const seedConfig = {directory: './db/seeds'};

knex.migrate.latest(migrateConfig).then(function() {
    knex.select().from('user').then(users => {
        if (!users || users.length == 0) {
            knex.seed.run(seedConfig);
        }
    });
});