'use strict';

const facebookService = require('../services/facebookService');

var controller = {
    login: (req, res) => {
        facebookService.login(req.body.facebookAccessToken)
            .then(token => {
                    console.log("Acccess Token: " + token);
                    res.json({ authToken: token, success: true });
            })
            .error(error => {
                console.log(error);
                res.status(500).send({ error: "There was an error logging in with facebook", facebookError: error });
            })
            .catch(error => {
                console.log(error);
                res.status(500).send({ error: "Unknown internal server error" });
            });
    }
};

module.exports = controller;