exports.seed = function (knex, Promise) {
    return Promise.join(
        // Deletes ALL existing entries
        knex('user').del(),

        // Inserts seed entries
        knex('user').insert({nickname: 'Mac', full_name: 'Tim Michalski', is_visitor: false, token: '1'}),
        knex('user').insert({nickname: 'Hartford', full_name: 'Stephen Hart', is_visitor: false, token: '2'}),
        knex('user').insert({nickname: 'Schuurmie', full_name: 'Paul Schuurmans', is_visitor: false, token: '3'}),
        knex('user').insert({nickname: 'Donkey', full_name: 'Derek Studanski', is_visitor: false, token: '4'}),
        knex('user').insert({nickname: 'Fist', full_name: 'Mike Ward', is_visitor: false, token: '5'}),
        knex('user').insert({nickname: 'Schulznado', full_name: 'Mike Schulz', is_visitor: false, token: '6'})
    );
};
