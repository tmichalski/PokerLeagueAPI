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
        .fetch({withRelated: ['season', 'hostMember']});
}

function getEventMembers(user, eventId) {
    return memberService.getActiveByUser(user)
        .then(_getEventMembers);

    function _getEventMembers(currentLeagueMember) {
        eventId = parseInt(eventId);

        var buyinsSelect = Bookshelf.knex
            .select('leagueMemberId').sum('amount as amount')
            .from('eventActivity')
            .where('eventActivityTypeId', 2)
            .andWhere('eventId', eventId)
            .groupBy('leagueMemberId');

        var resultsSelect = Bookshelf.knex
            .select('leagueMemberId').sum('amount as amount')
            .from('eventActivity')
            .where('eventActivityTypeId', 3)
            .andWhere('eventId', eventId)
            .groupBy('leagueMemberId');


        return Bookshelf.knex
            .select('leagueMember.id', 'leagueMember.name', 'buyins.amount as buyins', 'results.amount as results')
            .from('leagueMember')

            // Validate Access
            .innerJoin('league', 'leagueMember.leagueId', 'league.id')
            .innerJoin('season', 'league.id', 'season.leagueId')
            .innerJoin('event', 'season.id', 'event.seasonId')

            // Buyins
            .leftJoin(buyinsSelect.as("buyins"), function() {
                this.on('leagueMember.id', '=', 'buyins.leagueMemberId')
            })

            // Results
            .leftJoin(resultsSelect.as("results"), function() {
                this.on('leagueMember.id', '=', 'results.leagueMemberId')
            })

            .where('event.id', eventId)
            .andWhere('league.id', currentLeagueMember.get('leagueId'))

            // Only Include members with Buy-ins
            .havingRaw('buyins IS NOT NULL OR results IS NOT NULL')

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
        .orderBy('createdDtm', 'asc')
    })
    .fetchAll({withRelated: ['leagueMember', 'eventActivityType', 'createdByUser']});
}

function saveEventActivity(user, eventId, activityIn) {
    var tasks = [
        getEvent(user, eventId),
        _validateType(activityIn.type),
        _getCurrentMember(user),
        _validateMember(activityIn.leagueMemberId),
        _getActivity(eventId, activityIn.activityId)
    ];

    return Promise.all(tasks).then(values => {
        var [event, type, currentMember, activityMember, eventActivity] = values;
        return _save(event, type, currentMember, activityMember, eventActivity);
    });

    function _validateType(typeId) {
       return EventActivityType.where({id: typeId}).fetch();
    }

    function _getCurrentMember(user) {
        return memberService.getActiveByUser(user);
    }

    function _validateMember(leagueMemberId) {
        return leagueMemberId ? memberService.get(user, leagueMemberId) : null
    }

    function _getActivity(eventId, activityId) {
        return EventActivity.where({id: activityId, eventId: eventId}).fetch();
    }

    function _save(event, type, currentMember, activityMember, eventActivity) {
        if (!event || !type) {
            console.log("saveEventActivity: Event or activity type not found. Aborting.");
            return {error: "Invalid event and/or event type provided."}
        }

        if (EventActivityTypeValues.NOTE == type.id) {
            activityMember = currentMember;
        } else if (EventActivityTypeValues.BUY_IN == type.id) {
            activityIn.note = activityMember.get('name') + " buys in for $" + activityIn.amount;
        } else if (EventActivityTypeValues.FINAL_RESULT == type.id) {
            activityIn.note = activityMember.get('name') + " final result is $" + activityIn.amount;
        }

        if (!activityMember) {
            console.log("saveEventActivity: Invalid league member. Aborting.");
            return {error: "Invalid event league member provided."}
        }

        if (eventActivity) {
            return eventActivity.save({
                eventActivityTypeId: type.id,
                note: activityIn.note,
                amount: activityIn.amount,
                leagueMemberId: activityMember.id,
                createdByUserId: user.id
            })    
        } else {
            return new EventActivity({
                eventId: event.id,
                eventActivityTypeId: type.id,
                note: activityIn.note,
                amount: activityIn.amount,
                leagueMemberId: activityMember.id,
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
        _validateMember(eventIn.seasonId, eventIn.hostMemberId),
        _validateUser(eventIn.seasonId, user.id)
    ];

    return Promise.all(tasks).then(values => {
        var [event, hostMemberSeason, appUserSeason] = values;
        return _save(event, hostMemberSeason, appUserSeason);
    });

    function _validateMember(seasonId, leagueMemberId) {
        return seasonService.getSeasonForActiveLeagueMember(seasonId, leagueMemberId);
    }

    function _validateUser(seasonId, userId) {
        return seasonService.getSeasonForActiveLeagueUser(seasonId, userId);
    }

    function _save(event, hostMemberSeason, appUserSeason) {
        if (!appUserSeason) {
            return {error: "Invalid season provided."}
        }

        if (!hostMemberSeason) {
            return {error: "Invalid event host member provided."}
        }

        if (event) {
            return event.save({
                name: eventIn.name,
                hostMemberId: eventIn.hostMemberId,
                eventDate: moment(eventIn.eventDate).toDate()
            })
        } else {
            return new Event({
                seasonId: eventIn.seasonId,
                name: eventIn.name,
                eventDate: moment(eventIn.eventDate).toDate(),
                hostMemberId: eventIn.hostMemberId
            }).save();
        }
    }
}

