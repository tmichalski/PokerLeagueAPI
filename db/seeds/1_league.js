exports.seed = function (knex, Promise) {
    return Promise.join(
        // Deletes ALL existing entries
        knex('league').del(),

        // Inserts seed entries
        knex('league').insert({name: "CRB Poker", access_code: "ABC123", is_deleted: false, created_by_user_id: 1}),

        knex('league_user').insert({league_id: 1, user_id: 1, is_admin: true, is_deleted: false}),
        knex('league_user').insert({league_id: 1, user_id: 2, is_admin: false, is_deleted: false}),
        knex('league_user').insert({league_id: 1, user_id: 3, is_admin: false, is_deleted: false}),
        knex('league_user').insert({league_id: 1, user_id: 4, is_admin: false, is_deleted: false}),
        knex('league_user').insert({league_id: 1, user_id: 5, is_admin: false, is_deleted: false}),
        knex('league_user').insert({league_id: 1, user_id: 6, is_admin: false, is_deleted: false})
    );
};
