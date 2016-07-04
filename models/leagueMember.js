'use strict';

const bookshelf = require('../db/bookshelf');

var leagueMember = bookshelf.Model.extend({
    tableName: 'leagueMember',

    visible: ['id', 'name', 'email', 'isAdmin', 'isActive', 'league', 'user', 'accessCode'],

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

module.exports = bookshelf.model('LeagueMember', leagueMember);