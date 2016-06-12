'use strict';

const bookshelf = require('../db/bookshelf');

var league = bookshelf.Model.extend({
    tableName: 'league',

    visible: ['id', 'name', 'accessCode', 'season', 'leagueUsers'],

    parse : function (response) {
        response.isActive = !!response.isActive;
        return response;
    },

    seasons: function() {
        return this.hasMany('Season', 'seasonId')
    },

    leagueUsers: function() {
        return this.hasMany('LeagueUser', 'leagueId')
    }
});

module.exports = bookshelf.model('League', league);