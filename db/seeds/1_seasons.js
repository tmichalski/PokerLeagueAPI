exports.seed = function (knex, Promise) {
    return Promise.join(
        // Deletes ALL existing entries
        knex('season').del(),

        // Inserts seed entries
        knex('season').insert({year: 2013, is_active: false, first_place_user_id: 1, first_place_winnings: 320.50}),
        knex('season').insert({year: 2014, is_active: false, first_place_user_id: 2, first_place_winnings: 150.00}),
        knex('season').insert({year: 2015, is_active: false, first_place_user_id: 3, first_place_winnings: 55.25}),
        knex('season').insert({year: 2016, is_active: true, first_place_user_id: 4, first_place_winnings: 2240.00})
    );
};
