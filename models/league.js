'use strict';

const bookshelf = require('../db/bookshelf');

var league = bookshelf.Model.extend({
    tableName: 'league',

    visible: ['id', 'name', 'season', 'leagueUsers'],

    parse : function (response) {
        response.isActive = !!response.isActive;
        return response;
    },

    seasons: function() {
        return this.hasMany('Season', 'seasonId')
    },

    leagueMembers: function() {
        return this.hasMany('LeagueMember', 'leagueId')
    }
});

module.exports = bookshelf.model('League', league);