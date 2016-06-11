'use strict';

const bookshelf = require('../db/bookshelf');

var eventNote = bookshelf.Model.extend({
    tableName: 'eventNote',

    visible: ['id', 'note', 'event', 'user'],

    event: function() {
        return this.belongsTo('Event', 'eventId');
    },

    user: function() {
        return this.belongsTo('User', 'userId');
    }
});

module.exports = bookshelf.model('EventNote', eventNote);