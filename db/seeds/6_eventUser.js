exports.seed = function (knex, Promise) {
    return knex('eventUser').insert([
        {eventId: 1, userId: 1},
        {eventId: 1, userId: 2},
        {eventId: 1, userId: 3},
        {eventId: 1, userId: 4},
        {eventId: 1, userId: 5},
        {eventId: 1, userId: 6},

        {eventId: 2, userId: 1},
        {eventId: 2, userId: 2},
        {eventId: 2, userId: 3},
        {eventId: 2, userId: 4},
        {eventId: 2, userId: 5},
        {eventId: 2, userId: 6}
    ])
};
