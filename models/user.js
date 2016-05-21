'use strict';

const bookshelf = require('../db/bookshelf');
//const Season = require('./season');

module.exports = bookshelf.Model.extend({
    tableName: 'user' //,

    // winningSeasons: function() {
    //     return this.hasMany(Season, "winning_user_id");
    // }
});