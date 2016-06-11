exports.seed = function (knex, Promise) {
    return Promise.join(
        // Deletes ALL existing entries
        knex('league').del(),

        // Inserts seed entries
        knex('league').insert({name: "CRB Poker", accessCode: "ABC123", isDeleted: false, createdByUserId: 1}),

        knex('leagueUser').insert({leagueId: 1, userId: 1, isAdmin: true, isActive: true, isDeleted: false}),
        knex('leagueUser').insert({leagueId: 1, userId: 2, isAdmin: false, isActive: true, isDeleted: false}),
        knex('leagueUser').insert({leagueId: 1, userId: 3, isAdmin: false, isActive: true, isDeleted: false}),
        knex('leagueUser').insert({leagueId: 1, userId: 4, isAdmin: false, isActive: true, isDeleted: false}),
        knex('leagueUser').insert({leagueId: 1, userId: 5, isAdmin: false, isActive: true, isDeleted: false}),
        knex('leagueUser').insert({leagueId: 1, userId: 6, isAdmin: false, isActive: true, isDeleted: false})
    );
};
