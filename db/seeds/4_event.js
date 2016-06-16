exports.seed = function (knex, Promise) {
    return knex('event').insert([
        {seasonId: 1, hostUserId: 1, name: 'Kickoff', eventDate: '2013-01-15'},
        {seasonId: 1, hostUserId: 2, name: 'Winter Blitz', eventDate: '2013-02-05'},
        {seasonId: 1, hostUserId: 3, name: 'Springtime', eventDate: '2013-03-25'}
    ])
};
