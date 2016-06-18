'use strict';

const Event = require('../models/event');
const EventActivity = require('../models/eventActivity');
const Bookshelf = require('../db/bookshelf');

module.exports = {
    getEvent: getEvent,
    getEventUsers: getEventUsers,
    getEventActivities: getEventActivities
};

///////////////

function getEvent(user, eventId) {
    var params = {'id': eventId};

    return Event.forge(params).query(function (q) {
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
        .fetch({withRelated: ['season', 'hostUser']});
}

function getEventUsers(user, eventId) {
    return Bookshelf.knex
        .select('user.id', 'user.name')
        .sum('eventBuyins.amount as buyins')
        .sum('eventResults.amount as results')
        .from('user')
        .innerJoin('eventUser', 'user.id', 'eventUser.userId')

        // Validate Access
        .innerJoin('event', 'eventUser.eventId', 'event.id')
        .innerJoin('season', 'event.seasonId', 'season.id')
        .innerJoin('league', 'season.leagueId', 'league.id')
        .innerJoin('leagueUser', 'league.id', 'leagueUser.leagueId')

        // Buyins
        .leftJoin('eventActivity as eventBuyins', function() {
            this.on('eventUser.userId', '=', 'eventBuyins.userId')
                .andOn('eventBuyins.eventActivityTypeId', '=', 2)
        })

        // Results
        .leftJoin('eventActivity as eventResults', function() {
            this.on('eventUser.userId', '=', 'eventResults.userId')
                .andOn('eventResults.eventActivityTypeId', '=', 3)
        })

        .where('eventUser.eventId', eventId)
        .andWhere('leagueUser.userId', user.id)
        .groupBy('user.id', 'user.name')
        .orderBy('results', 'desc');
}

function getEventActivities(user, eventId) {
    return EventActivity.forge().query(function (q) {
        q.innerJoin('event', function() {
            this.on('eventActivity.eventId', '=', 'event.id')
        })
        .innerJoin('season', function() {
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
        .andWhere('event.id', eventId)
        .orderBy('createdDtm', 'desc')
    })
    .fetchAll({withRelated: ['user', 'eventActivityType', 'createdByUser']});
}