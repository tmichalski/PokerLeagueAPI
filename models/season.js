'use strict';

const bookshelf = require('../db/bookshelf');

var season = bookshelf.Model.extend({
    tableName: 'season',

    visible: ['id', 'year', 'isActive', 'firstPlaceWinnings', 'firstPlaceUser', 'league', 'events'],

    parse : function (response) {
        response.isActive = !!response.isActive;
        response.isDeleted = !!response.isDeleted;
        return response;
    },

    firstPlaceUser: function() {
        return this.belongsTo('User', "firstPlaceUserId");
    },

    league: function() {
        return this.belongsTo('League', 'leagueId');
    },

    events: function() {
        return this.hasMany('Event', 'seasonId')
    }
});

module.exports = bookshelf.model('Season', season);