exports.seed = function (knex, Promise) {
    return knex('leagueMember').insert([
        {leagueId: 1, name: 'Mac',  accessCode: "ABC123", isAdmin: true, isActive: true, isDeleted: false},
        {leagueId: 1, name: 'Hart', accessCode: "ABC124", isAdmin: false, isActive: true, isDeleted: false},
        {leagueId: 1, name: 'Fist', accessCode: "ABC125", isAdmin: false, isActive: true, isDeleted: false},
        {leagueId: 1, name: 'Donkey',       userId: 4, accessCode: "ABC126", isAdmin: false, isActive: true, isDeleted: false},
        {leagueId: 1, name: 'Schulznado',   userId: 5, accessCode: "ABC127", isAdmin: false, isActive: true, isDeleted: false},
        {leagueId: 1, name: 'Phaaaawl',     userId: 6, accessCode: "ABC128", isAdmin: false, isActive: true, isDeleted: false}
    ])
};
