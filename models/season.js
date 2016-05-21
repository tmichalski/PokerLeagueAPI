'use strict';

const bookshelf = require('../db/bookshelf');
const Event = require('./event');
const User = require('./user');

module.exports = bookshelf.Model.extend({
    tableName: 'season',

    firstPlaceUser: function() {
        return this.belongsTo(User, "first_place_user_id");
    },

    events: function() {
        return this.hasMany(Event)
    }
});