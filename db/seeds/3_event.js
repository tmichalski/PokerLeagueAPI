exports.seed = function (knex, Promise) {
    return Promise.join(
        // Deletes ALL existing entries
        knex('event').del(),

        // Inserts seed entries
        knex('event').insert({seasonId: 1, hostUserId: 1, name: 'Kickoff', eventDate: '2013-01-15'}),
        knex('event').insert({seasonId: 1, hostUserId: 2, name: 'Winter Blitz', eventDate: '2013-02-05'}),
        knex('event').insert({seasonId: 1, hostUserId: 3, name: 'Springtime', eventDate: '2013-03-25'})
    );
};
