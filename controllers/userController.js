'use strict';

const userService = require('../services/userService');

var controller = {

    list: function(req, res) {
        userService.list().then(function (users) {
            res.json(users);
        })
    }

};

module.exports = controller;