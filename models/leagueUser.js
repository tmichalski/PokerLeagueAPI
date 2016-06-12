'use strict';

const bookshelf = require('../db/bookshelf');

var leagueUser = bookshelf.Model.extend({
    tableName: 'leagueUser',

    visible: ['isAdmin', 'isActive', 'league', 'user'],

    parse : function (response) {
        response.isAdmin = !!response.isAdmin;
        response.isActive = !!response.isActive;
        response.isDeleted = !!response.isDeleted;
        return response;
    },

    league: function() {
        return this.belongsTo('League', 'leagueId');
    },

    user: function() {
        return this.belongsTo('User', 'userId');
    }

});

module.exports = bookshelf.model('LeagueUser', leagueUser);