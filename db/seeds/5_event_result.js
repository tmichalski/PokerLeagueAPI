exports.seed = function (knex, Promise) {
    return Promise.join(
        // Deletes ALL existing entries
        knex('event_result').del(),

        // Inserts seed entries
        knex('event_result').insert({event_id: 1, user_id: 1, amount: 45.50}),
        knex('event_result').insert({event_id: 1, user_id: 2, amount: 145.00}),
        knex('event_result').insert({event_id: 1, user_id: 3, amount: -15.25}),
        knex('event_result').insert({event_id: 1, user_id: 4, amount: -125.50}),
        knex('event_result').insert({event_id: 1, user_id: 5, amount: -210.75}),
        knex('event_result').insert({event_id: 1, user_id: 6, amount: 5.00})
    );
};
