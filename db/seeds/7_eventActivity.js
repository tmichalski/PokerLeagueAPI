exports.seed = function (knex, Promise) {
    return knex('eventActivity').insert([
        {eventId: 1, userId: 3, eventActivityTypeId: 1, createdByUserId: 1, note: 'Schulz slaps down top pair to win $2'},
        {eventId: 1, userId: 3, eventActivityTypeId: 1, createdByUserId: 2, note: 'Derek and Ward go head to head on a ratty flop'},
        {eventId: 1, userId: 1, eventActivityTypeId: 2, createdByUserId: 3, note: 'Mac buys in for $60', amount: 60},
        {eventId: 1, userId: 2, eventActivityTypeId: 2, createdByUserId: 1, note: 'Hart buys in for $100', amount: 100},
        {eventId: 1, userId: 3, eventActivityTypeId: 2, createdByUserId: 2, note: 'Paul buys in for $100', amount: 100},
        {eventId: 1, userId: 4, eventActivityTypeId: 2, createdByUserId: 3, note: 'Derek buys in for $100', amount: 100},
        {eventId: 1, userId: 5, eventActivityTypeId: 2, createdByUserId: 1, note: 'Ward buys in for $100', amount: 100},
        {eventId: 1, userId: 6, eventActivityTypeId: 2, createdByUserId: 2, note: 'Schulz buys in for $100', amount: 100},
        {eventId: 1, userId: 1, eventActivityTypeId: 3, createdByUserId: 3, note: 'Mac winnings: $-125', amount: -125},
        {eventId: 1, userId: 2, eventActivityTypeId: 3, createdByUserId: 1, note: 'Hart winnings: $214', amount: 214},
        {eventId: 1, userId: 3, eventActivityTypeId: 3, createdByUserId: 2, note: 'Paul winnings: $75', amount: 75},
        {eventId: 1, userId: 4, eventActivityTypeId: 3, createdByUserId: 3, note: 'Derek winnings: -$251', amount: -251},
        {eventId: 1, userId: 5, eventActivityTypeId: 3, createdByUserId: 1, note: 'Ward winnings: $5', amount: 5},
        {eventId: 1, userId: 6, eventActivityTypeId: 3, createdByUserId: 2, note: 'Schulz winnings: $25', amount: 25},

        {eventId: 2, userId: 3, eventActivityTypeId: 1, createdByUserId: 1, note: 'Schulz slaps down top pair to win $2'},
        {eventId: 2, userId: 3, eventActivityTypeId: 1, createdByUserId: 2, note: 'Derek and Ward go head to head on a ratty flop'},
        {eventId: 2, userId: 1, eventActivityTypeId: 2, createdByUserId: 3, note: 'Mac buys in for $60', amount: 60},
        {eventId: 2, userId: 2, eventActivityTypeId: 2, createdByUserId: 1, note: 'Hart buys in for $100', amount: 100},
        {eventId: 2, userId: 3, eventActivityTypeId: 2, createdByUserId: 2, note: 'Paul buys in for $100', amount: 100},
        {eventId: 2, userId: 4, eventActivityTypeId: 2, createdByUserId: 3, note: 'Derek buys in for $100', amount: 100},
        {eventId: 2, userId: 5, eventActivityTypeId: 2, createdByUserId: 1, note: 'Ward buys in for $100', amount: 100},
        {eventId: 2, userId: 6, eventActivityTypeId: 2, createdByUserId: 2, note: 'Schulz buys in for $100', amount: 100},
        {eventId: 2, userId: 1, eventActivityTypeId: 3, createdByUserId: 3, note: 'Mac winnings: $-125', amount: -125},
        {eventId: 2, userId: 2, eventActivityTypeId: 3, createdByUserId: 1, note: 'Hart winnings: $214', amount: 214},
        {eventId: 2, userId: 3, eventActivityTypeId: 3, createdByUserId: 2, note: 'Paul winnings: $75', amount: 75},
        {eventId: 2, userId: 4, eventActivityTypeId: 3, createdByUserId: 3, note: 'Derek winnings: -$251', amount: -251},
        {eventId: 2, userId: 5, eventActivityTypeId: 3, createdByUserId: 1, note: 'Ward winnings: $5', amount: 5},
        {eventId: 2, userId: 6, eventActivityTypeId: 3, createdByUserId: 2, note: 'Schulz winnings: $25', amount: 25}
    ])
};
