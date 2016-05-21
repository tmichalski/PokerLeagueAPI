exports.seed = function (knex, Promise) {
    return Promise.join(
        // Deletes ALL existing entries
        knex('event').del(),

        // Inserts seed entries
        knex('event').insert({season_id: 1, host_user_id: 1, name: 'Kickoff', event_date: '2013-01-15'}),
        knex('event').insert({season_id: 1, host_user_id: 2, name: 'Winter Blitz', event_date: '2013-02-05'}),
        knex('event').insert({season_id: 1, host_user_id: 3, name: 'Springtime', event_date: '2013-03-25'})
    );
};
