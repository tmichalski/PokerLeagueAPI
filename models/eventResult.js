'use strict';

const bookshelf = require('../db/bookshelf');

var eventResult = bookshelf.Model.extend({
    tableName: 'eventResult',

    visible: ['id', 'amount', 'event', 'user'],

    event: function() {
        return this.belongsTo('Event', 'eventId');
    },

    user: function() {
        return this.belongsTo('User', 'userId');
    }
});

module.exports = bookshelf.model('EventResult', eventResult);