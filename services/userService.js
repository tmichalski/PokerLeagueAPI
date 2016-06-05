'use strict';

const User = require('../models/user');
const uuid = require('node-uuid');

var service = {

    get: function (id) {
        return User.forge({id: id})
            .fetch()
            .then(function (user) {
                return user;
            })
            .catch(function (error) {
                console.log("userService.get(id): error fetching user.");
                console.log(error);
                return null;
            });
    },

    list: function () {
        return User.where({isDeleted: false}).fetchAll();
    }

};

module.exports = service;

