'use strict';

const bookshelf = require('../db/bookshelf');
const Season = require('./season');
const LeagueUser = require('./leagueUser');

module.exports = bookshelf.Model.extend({
    tableName: 'league',

    seasons: function() {
        return this.hasMany(Season)
    },

    leagueUsers: function() {
        return this.hasMany(LeagueUser)
    }
});