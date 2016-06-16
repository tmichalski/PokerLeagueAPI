exports.seed = function (knex, Promise) {
    return knex('user').insert([
        {name: 'Mac', email: 'mac@test.com'},
        {name: 'Hartford', email: 'hart@test.com'},
        {name: 'Schuurmie', email: 'paul@test.com'},
        {name: 'Donkey', email: 'donkey@test.com'},
        {name: 'Fist', email: 'fist@test.com'},
        {name: 'Schulznado', email: 'schulz@test.com'}
    ]);
};
