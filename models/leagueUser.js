'use strict';

const bookshelf = require('../db/bookshelf');

var leagueUser = bookshelf.Model.extend({
    tableName: 'league_user',

    league: function() {
        return this.belongsTo('League');
    },

    user: function() {
        return this.belongsTo('User');
    }

});

module.exports = bookshelf.model('LeagueUser', leagueUser);