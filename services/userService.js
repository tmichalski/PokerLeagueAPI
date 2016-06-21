'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const User = require('../models/user');
const LeagueUser = require('../models/leagueUser');
const uuid = require('node-uuid');

module.exports = {
    getByUserId: getByUserId,
    getByCurrentUserAndUserId: getByCurrentUserAndUserId,
    listLeagues: listLeagues,
    list: list
};

///////////////

function getByUserId (id) {
    return User.forge({id: id})
        .fetch()
        .catch(function (error) {
            console.log("userService.get(id): error fetching user.");
            console.log(error);
            return null;
        });
}

function getByCurrentUserAndUserId(currentUser, userId) {
    if ('current' == userId) {
        return Promise.resolve(currentUser);
    }

    return User.forge({id: userId}).query(function (q) {
        q.innerJoin('leagueUser', function () {
            this.on('user.id', '=', 'leagueUser.userId')
        })
        .innerJoin('league', function () {
            this.on('leagueUser.id', '=', 'league.id')
        })
        .whereIn('league.id', function () {
            this.select('league.id')
                .from('league')
                .innerJoin('leagueUser', function () {
                    this.on('league.id', '=', 'leagueUser.leagueId')
                        .andOn(currentUser.id, '=', 'leagueUser.userId')
                })
                .where('league.isDeleted', false)
                .andWhere('leagueUser.isActive', true)
                .andWhere('leagueUser.isDeleted', false)
        })
        .andWhere('league.isDeleted', false)
        .andWhere('leagueUser.isActive', true)
        .andWhere('leagueUser.isDeleted', false)
    }).fetch();
}

function listLeagues(userId) {
    return LeagueUser.where({userId: userId, isActive: true, isDeleted: false}).fetchAll();
}

function list(user) {
    return _fetchActiveLeagueUser(user.id)
        .then(_fetchLeagueUsers);

    function _fetchActiveLeagueUser(userId) {
        return LeagueUser.where({userId: userId, isActive: true, isDeleted: false})
            .fetch();
    }

    function _fetchLeagueUsers(leagueUser)  {
        return LeagueUser.where({leagueId: leagueUser.get('leagueId'), isActive: true, isDeleted: false})
            .fetchAll({withRelated: ['user']})
            .then(marshallLeagueUserListAsUsers);
    }
}

function marshallLeagueUserListAsUsers(leagueUsers) {
    var users = [];
    if (leagueUsers) {
        leagueUsers.each(leagueUser => {
            users.push(marshallLeagueUserAsUser(leagueUser))
        })
    }
    return users;
}

function marshallLeagueUserAsUser(leagueUser) {
    if (leagueUser) {
        var user = leagueUser.related('user');
        user.set('isLeagueAdmin', leagueUser.get('isAdmin'));
        return user;
    }
    return null;
}