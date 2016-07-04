exports.seed = function (knex, Promise) {
    return knex('league').insert([
        {name: "CRB Poker", isDeleted: false, createdByUserId: 1}
    ])
};
