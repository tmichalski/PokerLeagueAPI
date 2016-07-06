'use strict';

const _ = require('lodash');
const Bookshelf = require('../db/bookshelf');
const LeagueMember = require('../models/leagueMember');
const EventActivityTypes = require('../models/eventActivityTypeValues');

module.exports = {
    get: get,
    getActiveByUser: getActiveByUser,
    getWithRankings: getWithRankings,
    list: list,
    add: add,
    update: update,
    delete: deleteMember
};

///////////////

function getActiveByUser(user) {
    return LeagueMember.forge().where({userId: user.id, isActive: true, isDeleted: false})
        .orderBy('leagueId', 'ASC')
        .fetch({withRelated: ['league']})
        .catch(error => console.log("getActiveByUser(user): Error retrieving LeagueMember for user_id=" + user.id, error));
}

function get(currentUser, leagueMemberId) {
    return getActiveByUser(currentUser)
        .then(_getMember);

    function _getMember(currentLeagueMember) {
        return LeagueMember.where({leagueId: currentLeagueMember.get('leagueId'), id: leagueMemberId, isDeleted: false}).fetch();
    }
}

function getWithRankings(currentUser, leagueMemberId) {
    return get(currentUser, leagueMemberId)
        .then(_getSeasons)
        .then(_packageResults);

    function _getSeasons(leagueMember) {
        return Bookshelf.knex.select('season.*').sum('eventActivity.amount as winnings')
            .from('eventActivity')
            .innerJoin('event', 'eventActivity.eventId', 'event.id')
            .innerJoin('season', 'event.seasonId', 'season.id')
            .where('eventActivity.leagueMemberId', leagueMember.get('id'))
            .andWhere('eventActivity.eventActivityTypeId', EventActivityTypes.FINAL_RESULT)
            .groupBy('season.id')
            .orderBy('season.year', 'desc')
            .then(rankings => {
                return [leagueMember, rankings]
            });
    }

    function _packageResults(memberAndSeasonsArray) {
        var [memberRow, seasonsRows] = memberAndSeasonsArray;
        var member = memberRow.serialize();
        member.seasons = _marshallSeasons(seasonsRows);
        return member;
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

function list(currentUser) {
    return getActiveByUser(currentUser)
        .then(_getMembers);

    function _getMembers(leagueMember) {
        return Bookshelf.knex
            .select('leagueMember.id', 'leagueMember.name', 'leagueMember.isActive', 'leagueMember.isAdmin', 'leagueMember.userId', 'leagueMember.accessCode', 'leagueMember.email')
            .sum('eventActivity.amount as winnings')
            .from('leagueMember')
            .leftJoin('eventActivity', function() {
                this.on('leagueMember.id', '=', 'eventActivity.leagueMemberId')
                    .andOn('eventActivity.eventActivityTypeId', '=', EventActivityTypes.FINAL_RESULT)
            })
            .where('leagueMember.leagueId', leagueMember.get('leagueId'))
            .andWhere('leagueMember.isDeleted', false)
            .groupBy('leagueMember.id')
            .orderBy('winnings', 'desc');
    }
}

function add(currentUser, name, email, isAdmin) {
    return getActiveByUser(currentUser)
        .then(_generateAccessCode)
        .then(_save);

    function _generateAccessCode(currentLeagueMember) {
        return generateAccessCode()
            .then(accessCode => {
                return [currentLeagueMember, accessCode];
            })
    }

    function _save(currentMemberAndAccessCode) {
        var [currentLeagueMember, accessCode] = currentMemberAndAccessCode;
        return new LeagueMember({
            leagueId: currentLeagueMember.get("leagueId"),
            name: name,
            email: email,
            accessCode: accessCode,
            isAdmin: isAdmin || false,
            isActive: true,
            isDeleted: false
        }).save()
    }
}

function update(currentUser, leagueMemberId, name, email, isActive, isAdmin) {
    return get(currentUser, leagueMemberId)
        .then(_save);

    function _save(leagueMember) {
        leagueMember.set('name', name);
        leagueMember.set('email', email);
        leagueMember.set('isActive', isActive);
        leagueMember.set('isAdmin', isAdmin);
        return leagueMember.save();
    }
}

function deleteMember(currentUser, leagueMemberId) {
    return get(currentUser, leagueMemberId)
        .then(_save);

    function _save(leagueMember) {
        leagueMember.set('isActive', false);
        leagueMember.set('isDeleted', true);
        return leagueMember.save();
    }
}

function generateAccessCode() {
    var accessCode = Math.floor(Math.random() * 100000); // should yield a number between 4-5 digits
    return LeagueMember.where({accessCode: accessCode})
        .fetch()
        .then(leagueMember => {
            if (leagueMember) {
                return generateAccessCode(leagueMember);
            } else {
                return accessCode;
            }
        });
}