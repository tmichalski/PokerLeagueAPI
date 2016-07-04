'use strict';

const Bookshelf = require('../db/bookshelf');
const League = require('../models/league');
const LeagueMember = require('../models/leagueMember');
const Season = require('../models/season');
const User = require('../models/user');

module.exports = {
    hasActiveLeague: hasActiveLeague,
    getActiveLeagueMember: getActiveLeagueMember,
    joinLeague: joinLeague,
    leaveLeague: leaveLeague,
    createLeague: createLeague,
    listLeagues: listLeagues
};

///////////////

function getActiveLeagueMember(user) {
    return LeagueMember.where({userId: user.id, isActive: true, isDeleted: false})
        .fetch({withRelated: ['league']})
        .orderBy('leagueId')
        .catch(error => console.log("getActiveLeagueMember(user): Error retrieving LeagueMember for user_id=" + user.id, error));
}

function hasActiveLeague(req, res, next) {
    return LeagueMember.forge({userId: req.user.id, isActive: true, isDeleted: false})
        .orderBy('id', 'DESC')
        .fetch()
        .then(function (leagueMember) {
            if (leagueMember) {
                next();
            } else {
                res.status(412).json({error: 'User is not involved in an active league.'});
            }
        });
}

function joinLeague(user, accessCode) {
    return LeagueMember
        .where({accessCode: accessCode})
        .fetch()
        .then(addUserToLeague);

    function addUserToLeague(leagueMember) {
        if (leagueMember) {
            console.log("joinLeague(): Found leagueMemberId=" + leagueMember.id);

            leagueMember.set('userId', user.id);
            leagueMember.set('isActive', true);
            leagueMember.set('isDeleted', false);

            return leagueMember.save()
                .then( () => {
                    return true;
                })
                .catch(err => {
                    console.out("Error updating LeagueMember", err);
                    return false;
                });
        } else {
            console.log("joinLeague(): Could not find league for AccessCode=" + accessCode);
            return false;
        }
    }
}

function leaveLeague(user) {
    return Bookshelf.knex('leagueMember')
        .where('userId', '=', user.id)
        .update({isActive: false})
        .then( () => {
            return true;
        })
        .catch(err => {
            console.log("Error updating LeagueMember records to being inactive.", err);
        });
}

function createLeague(user, name, seasonYear) {
    return _createLeague()
        .then(_createSeason)
        .then(_generateUserAccessCode)
        .then(_createLeagueMember)
        .then( () => {
            return {isSuccess: true}
        });

    function _createLeague() {
        return League.forge({name: name, createdByUserId: user.id}).save();
    }

    function _createSeason(league) {
        return Season.forge({leagueId: league.id, year: seasonYear}).save();
    }

    function _generateUserAccessCode(season) {
        return generateUserAccessCode(user)
            .then(accessCode => {
                return [season, accessCode];
            });
    }

    function _createLeagueMember(leagueMemberData) {
        var [season, userAccessCode] = leagueMemberData;
        return LeagueMember.forge({
            leagueId: season.get('leagueId'),
            userId: user.id,
            accessCode: userAccessCode,
            isAdmin: true
        }).save();
    }
}

function listLeagues(user) {
    return LeagueMember.where({userId: user.id}).fetchAll();
}

function generateUserAccessCode() {
    var accessCode = Math.floor(Math.random() * 100000); // should yield a number between 4-5 digits
    return LeagueMember.where({accessCode: accessCode})
        .fetch()
        .then(user => {
            if (user) {
                return generateUserAccessCode(user);
            } else {
                return accessCode;
            }
        });
}