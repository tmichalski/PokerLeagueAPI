exports.seed = function (knex, Promise) {
    return knex('league').insert([
        {name: "CRB Poker", accessCode: "ABC123", isDeleted: false, createdByUserId: 1}
    ])
};
