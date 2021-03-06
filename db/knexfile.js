module.exports = {
    development: {
        client: 'mysql',
        connection: {
            database: 'pokerleague',
            host: '127.0.0.1',
            user: 'pokerleague',
            password: 'pokerleague',
            port: 3306
        },
        pool: {
            min: 2,
            max: 10
        }
    },

    production: {
        client: 'mysql',
        connection: {
            database: process.env.RDS_DB_NAME,
            host: process.env.RDS_HOSTNAME,
            user: process.env.RDS_USERNAME,
            password: process.env.RDS_PASSWORD,
            port: process.env.RDS_PORT
        },
        pool: {
            min: 2,
            max: 20
        }
    }
};
