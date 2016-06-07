'use strict';

const LeagueUser = require('../models/leagueUser');

module.exports = {
    hasActiveLeague: hasActiveLeague,
    getActiveLeague: getActiveLeague
};

function getActiveLeague(user) {
    return LeagueUser.forge({user_id: user.id, is_active: true, is_deleted: false})
        .catch(error => console.log("getActiveLeague(user): Error retrieving LeagueUser for user_id="+ user.id, error));
}

function hasActiveLeague(req, res, next) {
    return LeagueUser.forge({user_id: req.user.id, is_active: true, is_deleted: false})
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




