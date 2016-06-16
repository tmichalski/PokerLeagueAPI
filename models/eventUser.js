'use strict';

const bookshelf = require('../db/bookshelf');

var eventUser = bookshelf.Model.extend({
    tableName: 'eventUser',

    visible: ['id', 'event', 'user'],

    event: function() {
        return this.belongsTo('Event', 'eventId');
    },

    user: function() {
        return this.belongsTo('User', 'userId');
    }
});

module.exports = bookshelf.model('EventUser', eventUser);