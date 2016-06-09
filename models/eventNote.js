'use strict';

const bookshelf = require('../db/bookshelf');

var eventNote = bookshelf.Model.extend({
    tableName: 'event_note',

    event: function() {
        return this.belongsTo('Event');
    },

    user: function() {
        return this.belongsTo('User');
    }
});

module.exports = bookshelf.model('EventNote', eventNote);