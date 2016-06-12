'use strict';

const leagueService = require('../services/leagueService');

var controller = {

    join: function(req, res) {
        leagueService.joinLeague(req.user, req.body.accessCode).then(function (isSuccess) {
            res.json({isSuccess: isSuccess});
        })
    }

};

module.exports = controller;