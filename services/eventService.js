'use strict';

const Event = require('../models/event');
const EventActivity = require('../models/eventActivity');
const EventActivityType = require('../models/eventActivityType');
const EventActivityTypeValues = require('../models/eventActivityTypeValues');
const Bookshelf = require('../db/bookshelf');
const Promise = require('bluebird');

module.exports = {
    getEvent: getEvent,
    getEventUsers: getEventUsers,
    getEventActivities: getEventActivities,
    saveEventActivity: saveEventActivity,
    deleteEventActivity: deleteEventActivity
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

function saveEventActivity(user, eventId, activityIn) {
    var tasks = [
        getEvent(user, eventId),
        _validateType(activityIn.type),
        _validateUser(activityIn.userId),
        _getActivity(eventId, activityIn.activityId)
    ];

    return Promise.all(tasks).then(values => {
        var [event, type, activityUser, eventActivity] = values;
        return _save(event, type, activityUser, eventActivity);
    });

    function _validateType(typeId) {
       return EventActivityType.where({id: typeId}).fetch();
    }

    function _validateUser(userId) {
        return userId ? getEvent({id: userId}, eventId) : null
    }

    function _getActivity(eventId, activityId) {
        return EventActivity.where({id: activityId, eventId: eventId}).fetch();
    }

    function _save(event, type, activityUser, eventActivity) {
        if (!event || !type) {
            console.log("saveEventActivity: Event or activity type not found. Aborting.");
            return {error: "Invalid event and/or event type provided."}
        }

        if (EventActivityTypeValues.NOTE == type.id) {
            activityUser = user;
        }

        if (!activityUser) {
            console.log("saveEventActivity: Invalid user. Aborting.");
            return {error: "Invalid event user provided."}
        }


        if (eventActivity) {
            return eventActivity.save({
                eventActivityTypeId: type.id,
                note: activityIn.note,
                amount: activityIn.amount,
                userId: activityUser.id,
                createdByUserId: user.id
            })    
        } else {
            return new EventActivity({
                eventId: event.id,
                eventActivityTypeId: type.id,
                note: activityIn.note,
                amount: activityIn.amount,
                userId: activityUser.id,
                createdByUserId: user.id
            }).save();
        }
    }
}

function deleteEventActivity(user, eventId, eventActivityId) {
    var tasks = [
        getEvent(user, eventId),
        _getActivity(eventActivityId)
    ];

    return Promise.all(tasks).then(values => {
        var [event, eventActivity] = values;
        return _delete(event, eventActivity);
    });

    function _getActivity(activityId) {
        return EventActivity.where({id: activityId, eventId: eventId}).fetch();
    }

    function _delete(event, eventActivity) {
        if (!event || !eventActivity) {
            console.log("deleteEventActivity: Event or activity not found. Aborting.");
            return {isSuccess: false, error: "Invalid event and/or activity provided."}
        }

        eventActivity.save({
            isDeleted: true
        }).then(eventActivity => {
            return {isSuccess: true}
        }).catch(function(error) {
            return {isSuccess: false, error: error}
        });
    }
}
