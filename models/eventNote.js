'use strict';

const bookshelf = require('../db/bookshelf');
const Event = require('./event');
const User = require('./user');

module.exports = bookshelf.Model.extend({
    tableName: 'event_note',

    event: function() {
        return this.belongsTo(Event);
    },

    user: function() {
        return this.belongsTo(User);
    }
});