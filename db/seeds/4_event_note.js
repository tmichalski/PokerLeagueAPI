exports.seed = function (knex, Promise) {
    return Promise.join(
        // Deletes ALL existing entries
        knex('event_note').del(),

        // Inserts seed entries
        knex('event_note').insert({
            event_id: 1,
            user_id: 1,
            note: "Derek goes all in with a pair of Ks vs Ward's stright draw."
        }),

        knex('event_note').insert({
            event_id: 1,
            user_id: 1,
            note: "Paul bets $5 pre-flop and pisses everyone off"
        }),

        knex('event_note').insert({
            event_id: 1,
            user_id: 2,
            note: "Ward hammers his fist down on Paul's exposed straight gooch with a nut flush"
        })
    );
};
