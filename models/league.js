'use strict';

const bookshelf = require('../db/bookshelf');

var league = bookshelf.Model.extend({
    tableName: 'league',

    seasons: function() {
        return this.hasMany('Season')
    },

    leagueUsers: function() {
        return this.hasMany('LeagueUser')
    }
});

module.exports = bookshelf.model('League', league);