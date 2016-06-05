exports.seed = function (knex, Promise) {
    return Promise.join(
        // Deletes ALL existing entries
        knex('user').del(),

        // Inserts seed entries
        knex('user').insert({name: 'Mac', email: 'mac@test.com'}),
        knex('user').insert({name: 'Hartford', email: 'hart@test.com'}),
        knex('user').insert({name: 'Schuurmie', email: 'paul@test.com'}),
        knex('user').insert({name: 'Donkey', email: 'donkey@test.com'}),
        knex('user').insert({name: 'Fist', email: 'fist@test.com'}),
        knex('user').insert({name: 'Schulznado', email: 'schulz@test.com'})
    );
};
