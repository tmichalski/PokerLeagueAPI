'use strict';

const Event = require('../models/event');

module.exports = {
    getEvent: getEvent
};

///////////////

function getEvent(user, eventId) {
    var params = {'id': eventId};

    return Event.forge(params).query(function (q) {
            // Inner join on Season
            // Inner join on League
            // Inner join on LeagueUser
            q.innerJoin('season', function() {
                this.on('event.seasonId', '=', 'season.id')
            })
            .innerJoin('league', function () {
                this.on('season.leagueId', '=', 'league.id')
            })
            .innerJoin('leagueUser', function () {
                this.on('league.id', '=', 'leagueUser.leagueId')
                    .andOn('leagueUser.userId', '=', user.id)
            })
            .where('season.isDeleted', false)
            .andWhere('league.isDeleted', false)
            .andWhere('leagueUser.isDeleted', false)
            .andWhere('leagueUser.isActive', true)
        })
        .fetch({withRelated: ['season', 'hostUser', 'eventActivities.eventActivityType']});
}