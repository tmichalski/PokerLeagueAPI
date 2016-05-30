'use strict';

const User = require('../models/user');

var service = {

    get: function (id) {
        User.forge({id: id, is_deleted: false})
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

    getByToken: function(token) {
        return User.forge({token: token})
            .fetch()
            .catch(function (error) {
                console.log("userService.getByToken(id): error fetching user.");
                console.log(error);
            });
    }

};

module.exports = service;

