'use strict';

const leagueService = require('../services/leagueService');

module.exports = {
    join: join,
    leave: leave
};

//////////////

function join(req, res) {
    leagueService.joinLeague(req.user, req.body.accessCode).then(isSuccess => {
        res.json({isSuccess: isSuccess});
    })
}

function leave(req, res) {
    leagueService.leaveLeague(req.user).then(isSuccess => {
        res.json({isSuccess: isSuccess});
    });
}