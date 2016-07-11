'use strict';

const bookshelf = require('../db/bookshelf');

var season = bookshelf.Model.extend({
    tableName: 'season',

    visible: ['id', 'year', 'isActive', 'firstPlaceLeagueMemberId', 'firstPlaceLeagueMemberName', 'firstPlaceWinnings', 'league', 'events'],

    parse : function (response) {
        response.isActive = !!response.isActive;
        response.isDeleted = !!response.isDeleted;
        return response;
    },

    league: function() {
        return this.belongsTo('League', 'leagueId');
    }
});

module.exports = bookshelf.model('Season', season);