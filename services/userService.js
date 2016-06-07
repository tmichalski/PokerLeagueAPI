'use strict';

const User = require('../models/user');
const LeagueUser = require('../models/leagueUser');
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

    listLeagues: function(userId) {
        return LeagueUser.where({user_id: userId, is_active: true, is_deleted: false}).fetchAll();
    },

    list: function () {
        return User.where({isDeleted: false}).fetchAll();
    }

};

module.exports = service;

