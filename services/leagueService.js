'use strict';

const League = require('../models/league');
const LeagueUser = require('../models/leagueUser');

module.exports = {
    hasActiveLeague: hasActiveLeague,
    getActiveLeague: getActiveLeague,
    joinLeague: joinLeague
};

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
            LeagueUser.forge({
                userId: user.id,
                leagueId: league.id,
                isActive: true,
                isAdmin: false
            })
            .save()
                .catch(err => {
                  console.out("Error saving LeagueUser");
                });
            return true;

        } else {
            console.log("joinLeague(): Could not find league for AccessCode=" + accessCode);
            return false;
        }
    }
}




