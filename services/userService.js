'use strict';

const _ = require('lodash');
const Bookshelf = require('../db/bookshelf');
const Promise = require('bluebird');
const User = require('../models/user');
const LeagueMember = require('../models/leagueMember');
const uuid = require('node-uuid');
const EventActivityTypes = require('../models/eventActivityTypeValues');

const leagueService = require('../services/leagueService');

module.exports = {
    getByUserId: getByUserId,
    getByCurrentUserAndUserId: getByCurrentUserAndUserId,
    list: list
};

///////////////

function getByUserId(id) {
    return User.forge({id: id})
        .fetch()
        .catch(function (error) {
            console.log("userService.get(id): error fetching user.");
            console.log(error);
            return null;
        });
}

function getByCurrentUserAndUserId(currentUser, userId) {
    if ('current' == userId) {
        return Promise.resolve(currentUser);
    }

    return leagueService.getActiveLeagueMember(currentUser) 
        .then(_getUser)
        .then(_getSeasons)
        .then(_packageResults);

    function _getUser(league) {
        return User.forge({id: userId}).query(function (q) {
            q.innerJoin('leagueMember', function () {
                this.on('user.id', '=', 'leagueMember.userId')
            })
            .innerJoin('league', function () {
                this.on('leagueMember.leagueId', '=', 'league.id')
            })
            .where('league.id', league.get('id'))
            .andWhere('league.isDeleted', false)
            .andWhere('leagueMember.isActive', true)
            .andWhere('leagueMember.isDeleted', false)
        })
        .fetch()
        .then(user => {
            return [league, user]
        });
    }

    function _getSeasons(leagueAndUser) {
        var [league, user] = leagueAndUser;

        return Bookshelf.knex.select('season.*').sum('eventActivity.amount as winnings')
            .from('eventActivity')
            .innerJoin('user', 'eventActivity.userId', 'user.id')
            .innerJoin('event', 'eventActivity.eventId', 'event.id')
            .innerJoin('season', 'event.seasonId', 'season.id')
            .where('season.leagueId', league.get('id'))
            .andWhere('user.id', user.get('id'))
            .andWhere('eventActivity.eventActivityTypeId', EventActivityTypes.FINAL_RESULT)
            .groupBy('season.id')
            .orderBy('season.year', 'desc')
            .then(rankings => {
                return [user, rankings]
            });
    }

    function _packageResults(userAndSeasonsArray) {
        var [userRow, seasonsRows] = userAndSeasonsArray;
        var user = userRow.serialize();
        user.seasons = _marshallSeasons(seasonsRows);
        return user;
    }

    function _marshallSeasons(seasons) {
        if (seasons == undefined) return;
        var out = [];
        _(seasons).each(function (season) {
            out.push({
                id: season.id,
                year: season.year,
                winnings: season.winnings
            });
        });
        return out;
    }
}

function list(user) {
    return _fetchActiveLeagueMember(user.id)
        .then(_fetchLeagueMembers);

    function _fetchActiveLeagueMember(userId) {
        return LeagueMember.where({userId: userId, isActive: true, isDeleted: false})
            .fetch();
    }

    function _fetchLeagueMembers(leagueMember) {
        return LeagueMember.where({leagueId: leagueMember.get('leagueId'), isActive: true, isDeleted: false})
            .fetchAll({withRelated: ['user']})
            .then(marshallLeagueMemberListAsUsers);
    }
}

function marshallLeagueMemberListAsUsers(leagueMembers) {
    var users = [];
    if (leagueMembers) {
        leagueMembers.each(leagueMember => {
            users.push(marshallLeagueMemberAsUser(leagueMember))
        })
    }
    return users;
}

function marshallLeagueMemberAsUser(leagueMember) {
    if (leagueMember) {
        var user = leagueMember.related('user');
        user.set('isLeagueAdmin', leagueMember.get('isAdmin'));
        return user;
    }
    return null;
}