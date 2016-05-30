'use strict';

const User = require('../models/user');

var controller = {

    list: function(req, res) {
        User.fetchAll().then(function (users) {
            res.json(users);
        })
    }

};

module.exports = controller;