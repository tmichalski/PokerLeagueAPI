// Update with your config settings.

module.exports = {

    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'pokerleague',
        password: 'pokerleague',
        database: 'pokerleague'
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName: 'knex_migrations'
    }

//   development: {
//     client: 'mysql',
//     connection: {
//       host: '127.0.0.1',
//       user: 'pokerleague',
//       password: 'pokerleague',
//       database: 'pokerleague'
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       tableName: 'knex_migrations'
//     }
//   },
//
//   staging: {
//     client: 'mysql',
//     connection: {
//       host: '127.0.0.1',
//       user: 'pokerleague',
//       password: 'pokerleague',
//       database: 'pokerleague'
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       tableName: 'knex_migrations'
//     }
//   },
//
//   production: {
//     client: 'mysql',
//     connection: {
//       host: '127.0.0.1',
//       user: 'pokerleague',
//       password: 'pokerleague',
//       database: 'pokerleague'
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       tableName: 'knex_migrations'
//     }
//   }
//
};
