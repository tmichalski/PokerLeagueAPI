'use strict';

const leagueService = require('../services/leagueService');

module.exports = {
    join: join,
    leave: leave,
    create: create,
    getLeague: getLeague
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

function create(req, res) {
    leagueService.createLeague(req.user, req.body.name, req.body.seasonYear).then(response => {
        res.json(response);
    });
}

function getLeague(req, res) {
    leagueService.getActiveLeagueMember(req.user).then(leagueMember => {
        res.json(leagueMember);
    });
}