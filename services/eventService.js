'use strict';

const Event = require('../models/event');
const EventActivity = require('../models/eventActivity');
const EventActivityType = require('../models/eventActivityType');
const EventActivityTypeValues = require('../models/eventActivityTypeValues');
const Bookshelf = require('../db/bookshelf');
const Promise = require('bluebird');
const moment = require('moment');
const seasonService = require('./seasonService');
const memberService = require('./memberService');

module.exports = {
    getEvent: getEvent,
    getEventMembers: getEventMembers,
    getEventActivities: getEventActivities,
    saveEventActivity: saveEventActivity,
    deleteEventActivity: deleteEventActivity,
    saveEvent: saveEvent
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
            .innerJoin('leagueMember', function () {
                this.on('league.id', '=', 'leagueMember.leagueId')
                    .andOn('leagueMember.userId', '=', user.id)
            })
            .where('season.isDeleted', false)
            .andWhere('league.isDeleted', false)
            .andWhere('leagueMember.isDeleted', false)
            .andWhere('leagueMember.isActive', true)
        })
        .fetch({withRelated: ['season', 'hostUser']});
}

function getEventMembers(user, eventId) {
    return memberService.getActiveByUser(user)
        .then(_getEventMembers);

    function _getEventMembers(currentLeagueMember) {
        return Bookshelf.knex
            .select('leagueMember.id', 'leagueMember.name')
            .sum('eventBuyins.amount as buyins')
            .sum('eventResults.amount as results')
            .from('leagueMember')

            // Validate Access
            .innerJoin('league', 'leagueMember.leagueId', 'league.id')
            .innerJoin('season', 'league.id', 'season.leagueId')
            .innerJoin('event', 'season.id', 'event.seasonId')

            // Buyins
            .leftJoin('eventActivity as eventBuyins', function() {
                this.on('leagueMember.id', '=', 'eventBuyins.leagueMemberId')
                    .andOn('eventBuyins.eventActivityTypeId', '=', EventActivityTypeValues.BUY_IN)
            })

            // Results
            .leftJoin('eventActivity as eventResults', function() {
                this.on('leagueMember.id', '=', 'eventResults.leagueMemberId')
                    .andOn('eventResults.eventActivityTypeId', '=', EventActivityTypeValues.FINAL_RESULT)
            })

            .where('event.id', eventId)
            .andWhere('league.id', currentLeagueMember.get('leagueId'))

            .groupBy('leagueMember.id', 'leagueMember.name')

            // Only Include members with Buy-ins
            .having('buyins', '>', 0)

            .orderBy('results', 'desc');
    }
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
        .innerJoin('leagueMember', function () {
            this.on('league.id', '=', 'leagueMember.leagueId')
                .andOn('leagueMember.userId', '=', user.id)
        })
        .where('season.isDeleted', false)
        .andWhere('league.isDeleted', false)
        .andWhere('leagueMember.isDeleted', false)
        .andWhere('leagueMember.isActive', true)
        .andWhere('event.id', eventId)
        .orderBy('createdDtm', 'desc')
    })
    .fetchAll({withRelated: ['leagueMember', 'eventActivityType', 'createdByUser']});
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

function saveEvent(user, eventIn) {
    var tasks = [
        getEvent(user, eventIn.id),
        _validateUser(eventIn.seasonId, eventIn.hostUserId),
        _validateUser(eventIn.seasonId, user.id)
    ];

    return Promise.all(tasks).then(values => {
        var [event, hostUserSeason, appUserSeason] = values;
        return _save(event, hostUserSeason, appUserSeason);
    });

    function _validateUser(seasonId, userId) {
        return seasonService.getSeasonForActiveLeagueMember(seasonId, userId);
    }

    function _save(event, hostUserSeason, appUserSeason) {
        if (!appUserSeason) {
            return {error: "Invalid season provided."}
        }

        if (!hostUserSeason) {
            return {error: "Invalid event host user provided."}
        }

        if (event) {
            return event.save({
                name: eventIn.name,
                hostUserId: eventIn.hostUserId,
                eventDate: moment(eventIn.eventDate).toDate()
            })
        } else {
            return new Event({
                seasonId: eventIn.seasonId,
                name: eventIn.name,
                eventDate: moment(eventIn.eventDate).toDate(),
                hostUserId: eventIn.hostUserId
            }).save();
        }
    }
}

