'use strict';

const bookshelf = require('../db/bookshelf');

var eventActivity = bookshelf.Model.extend({
    tableName: 'eventActivity',

    visible: ['id', 'note', 'amount', 'event', 'user', 'eventActivityType'],

    event: function() {
        return this.belongsTo('Event', 'eventId');
    },

    eventActivityType: function() {
        return this.belongsTo('EventActivityType', 'eventActivityTypeId');
    },

    user: function() {
        return this.belongsTo('User', 'userId');
    }
});

module.exports = bookshelf.model('EventActivity', eventActivity);