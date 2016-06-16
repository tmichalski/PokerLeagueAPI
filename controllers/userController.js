'use strict';

const userService = require('../services/userService');

module.exports = {
    list: list,
    get: get
};

///////////////

function list(req, res) {
    userService.list(req.user).then(function (users) {
        res.json(users);
    })
}

function get(req, res) {
    userService.getByCurrentUserAndUserId(req.user, req.params.id).then(function (user) {
        res.json(user);
    });
}