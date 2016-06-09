'use strict';

const bookshelf = require('../db/bookshelf');

var season = bookshelf.Model.extend({
    tableName: 'season',

    firstPlaceUser: function() {
        return this.belongsTo('User', "first_place_user_id");
    },

    league: function() {
        return this.belongsTo('League');
    },

    events: function() {
        return this.hasMany('Event')
    }
});

module.exports = bookshelf.model('Season', season);