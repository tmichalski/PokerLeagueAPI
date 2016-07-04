'use strict';

const userService = require('../services/userService');

module.exports = {
    list: listUser,
    get: getUser
};

///////////////

function listUser(req, res) {
    userService.list(req.user).then(function (users) {
        res.json(users);
    })
}

function getUser(req, res) {
    userService.getByCurrentUserAndUserId(req.user, req.params.id).then(function (user) {
        res.json(user);
    });
}