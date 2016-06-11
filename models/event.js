'use strict';

const bookshelf = require('../db/bookshelf');

var event = bookshelf.Model.extend({
    tableName: 'event',

    visible: ['id', 'name', 'eventDate', 'season', 'hostUser'],

    season: function() {
        return this.belongsTo('Season', 'seasonId');
    },

    hostUser: function() {
        return this.belongsTo('User', 'hostUserId');
    }
});

module.exports = bookshelf.model('Event', event);