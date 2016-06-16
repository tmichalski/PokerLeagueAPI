'use strict';

const Promise = require('bluebird');
const userService = require('../services/userService');
const passportService = require('../services/passportService');
const facebookService = require('../services/facebookService');

module.exports = {
    login: login
};

///////////////

function login(req, res) {
    facebookService.login(req.body.facebookAccessToken)
        .then(user => {

            var tasks = [
                passportService.generateToken(user),
                userService.listLeagues(user.id)
            ];

            Promise.all(tasks).then(values => {
                var token = values[0];
                var leagues = values[1];
                res.json({authToken: token, user: user, leagues: leagues});
            });
        })
        .error(error => {
            console.log(error);
            res.status(500).send({error: "There was an error logging in with facebook", facebookError: error});
        })
        .catch(error => {
            console.log(error);
            res.status(500).send({error: "Unknown internal server error"});
        });
}