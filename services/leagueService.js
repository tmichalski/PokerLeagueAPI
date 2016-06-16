'use strict';

const Bookshelf = require('../db/bookshelf');
const League = require('../models/league');
const LeagueUser = require('../models/leagueUser');

module.exports = {
    hasActiveLeague: hasActiveLeague,
    getActiveLeague: getActiveLeague,
    joinLeague: joinLeague,
    leaveLeague: leaveLeague
};

///////////////

function getActiveLeague(user) {
    return LeagueUser.forge({userId: user.id, isActive: true, isDeleted: false})
        .catch(error => console.log("getActiveLeague(user): Error retrieving LeagueUser for user_id=" + user.id, error));
}

function hasActiveLeague(req, res, next) {
    return LeagueUser.forge({userId: req.user.id, isActive: true, isDeleted: false})
        .orderBy('id', 'DESC')
        .fetch()
        .then(function (leagueUser) {
            if (leagueUser) {
                next();
            } else {
                res.status(412).json({error: 'User is not involved in an active league.'});
            }
        });
}

function joinLeague(user, accessCode) {
    return League
        .where({accessCode: accessCode})
        .fetch()
        .then(addUserToLeague);

    function addUserToLeague(league) {
        if (league) {
            console.log("joinLeague(): Found leagueId=" + league.id);
            return LeagueUser
                .where({userId: user.id, leagueId: league.id})
                .fetch()
                .then(leagueUser => {
                    addOrUpdateLeagueUser(league, leagueUser);
                });
        } else {
            console.log("joinLeague(): Could not find league for AccessCode=" + accessCode);
            return false;
        }
    }

    function addOrUpdateLeagueUser(league, leagueUser) {
        if (leagueUser) {
            leagueUser.set('isActive', true);
            leagueUser.set('isDeleted', false);

            return leagueUser.save()
                .then( () => {return true} )
                .catch(err => {
                    console.out("Error updating LeagueUser", err);
                    return false;
                });

        } else {
            return LeagueUser.forge({
                userId: user.id,
                leagueId: league.id,
                isActive: true,
                isAdmin: false
            })
            .save()
            .then( () => {return true})
            .catch(err => {
                console.out("Error saving LeagueUser", err);
                return false
            });
        }
    }
}

function leaveLeague(user) {
    return Bookshelf.knex('leagueUser')
        .where('userId', '=', user.id)
        .update({isActive: false})
        .then( () => {
            return true;
        })
        .catch(err => {
            console.log("Error updating LeagueUser records to being inactive.", err);
        });
}





