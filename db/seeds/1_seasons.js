exports.seed = function (knex, Promise) {
    return Promise.join(
        // Deletes ALL existing entries
        knex('season').del(),

        // Inserts seed entries
        knex('season').insert({year: 2013, is_active: false}),
        knex('season').insert({year: 2014, is_active: false}),
        knex('season').insert({year: 2015, is_active: false}),
        knex('season').insert({year: 2016, is_active: true})
    );
};
