exports.seed = function (knex, Promise) {
    return knex('leagueUser').insert([
        {leagueId: 1, userId: 1, isAdmin: true, isActive: true, isDeleted: false},
        {leagueId: 1, userId: 2, isAdmin: false, isActive: true, isDeleted: false},
        {leagueId: 1, userId: 3, isAdmin: false, isActive: true, isDeleted: false},
        {leagueId: 1, userId: 4, isAdmin: false, isActive: true, isDeleted: false},
        {leagueId: 1, userId: 5, isAdmin: false, isActive: true, isDeleted: false},
        {leagueId: 1, userId: 6, isAdmin: false, isActive: true, isDeleted: false}
    ])
};
