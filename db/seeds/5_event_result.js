exports.seed = function (knex, Promise) {
    return Promise.join(
        // Deletes ALL existing entries
        knex('eventResult').del(),

        // Inserts seed entries
        knex('eventResult').insert({eventId: 1, userId: 1, amount: 45.50}),
        knex('eventResult').insert({eventId: 1, userId: 2, amount: 145.00}),
        knex('eventResult').insert({eventId: 1, userId: 3, amount: -15.25}),
        knex('eventResult').insert({eventId: 1, userId: 4, amount: -125.50}),
        knex('eventResult').insert({eventId: 1, userId: 5, amount: -210.75}),
        knex('eventResult').insert({eventId: 1, userId: 6, amount: 5.00}),

        knex('eventResult').insert({eventId: 2, userId: 1, amount: 35.50}),
        knex('eventResult').insert({eventId: 2, userId: 2, amount: 45.00}),
        knex('eventResult').insert({eventId: 2, userId: 3, amount: -115.25}),
        knex('eventResult').insert({eventId: 2, userId: 4, amount: 225.50}),
        knex('eventResult').insert({eventId: 2, userId: 5, amount: -50.75}),
        knex('eventResult').insert({eventId: 2, userId: 6, amount: -54.00})
    );
};
