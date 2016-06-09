'use strict';

const bookshelf = require('../db/bookshelf');

var eventResult = bookshelf.Model.extend({
    tableName: 'event_result',

    event: function() {
        return this.belongsTo('Event');
    },

    user: function() {
        return this.belongsTo('User');
    }
});

module.exports = bookshelf.model('EventResult', eventResult);