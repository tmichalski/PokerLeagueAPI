'use strict';

const userService = require('../services/userService');

var controller = {

    list: function(req, res) {
        userService.list(req.user).then(function (users) {
            res.json(users);
        })
    },

    get: function(req, res) {
        userService.getByCurrentUserAndUserId(req.user, req.params.id).then(function(user) {
            res.json(user);
        });
    }

};

module.exports = controller;