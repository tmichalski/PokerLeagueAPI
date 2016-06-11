exports.seed = function (knex, Promise) {
    return Promise.join(
        // Deletes ALL existing entries
        knex('eventNote').del(),

        // Inserts seed entries
        knex('eventNote').insert({
            eventId: 1,
            userId: 1,
            note: "Derek goes all in with a pair of Ks vs Ward's stright draw."
        }),

        knex('eventNote').insert({
            eventId: 1,
            userId: 1,
            note: "Paul bets $5 pre-flop and pisses everyone off"
        }),

        knex('eventNote').insert({
            eventId: 1,
            userId: 2,
            note: "Ward hammers his fist down on Paul's exposed straight gooch with a nut flush"
        })
    );
};
