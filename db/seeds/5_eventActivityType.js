exports.seed = function (knex, Promise) {
    return knex('eventActivityType').insert([
        {name: 'Note'},
        {name: 'Buy-in'},
        {name: 'Final Result'}
    ])
};
