exports.seed = function (knex, Promise) {
    return knex('season').insert([
        {
            leagueId: 1,
            year: 2013,
            isActive: false,
            isDeleted: false,
            firstPlaceUserId: 1,
            firstPlaceWinnings: 320.50
        },
        {
            leagueId: 1,
            year: 2014,
            isActive: false,
            isDeleted: false,
            firstPlaceUserId: 2,
            firstPlaceWinnings: 150.00
        },
        {
            leagueId: 1,
            year: 2015,
            isActive: false,
            isDeleted: false,
            firstPlaceUserId: 3,
            firstPlaceWinnings: 55.25
        },
        {
            leagueId: 1,
            year: 2016,
            isActive: true,
            isDeleted: false,
            firstPlaceUserId: 4,
            firstPlaceWinnings: 2240.00
        }
    ])
};
