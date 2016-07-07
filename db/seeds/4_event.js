exports.seed = function (knex, Promise) {
    return knex('event').insert([
        {seasonId: 1, hostMemberId: 1, name: 'Kickoff', eventDate: '2013-01-15 18:00:00'},
        {seasonId: 1, hostMemberId: 2, name: 'Winter Blitz', eventDate: '2013-02-05 18:00:00'},
        {seasonId: 1, hostMemberId: 3, name: 'Springtime', eventDate: '2013-03-25 19:00:00'}
    ])
};
