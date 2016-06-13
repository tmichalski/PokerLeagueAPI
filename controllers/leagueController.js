'use strict';

const leagueService = require('../services/leagueService');

var controller = {

    join: function(req, res) {
        leagueService.joinLeague(req.user, req.body.accessCode).then(isSuccess => {
            res.json({isSuccess: isSuccess});
        })
    },

    leave: function(req, res) {
        leagueService.leaveLeague(req.user).then(isSuccess => {
           res.json({isSuccess: isSuccess});
        });
    }

};

module.exports = controller;