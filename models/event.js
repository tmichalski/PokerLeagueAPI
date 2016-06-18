'use strict';

const bookshelf = require('../db/bookshelf');

var event = bookshelf.Model.extend({
    tableName: 'event',

    visible: ['id', 'name', 'eventDate', 'season', 'hostUser', 'eventUsers', 'eventActivities'],

    season: function() {
        return this.belongsTo('Season', 'seasonId');
    },

    hostUser: function() {
        return this.belongsTo('User', 'hostUserId');
    },

    eventActivities: function() {
        return this.hasMany('EventActivity', 'eventId')
    },

    eventUsers: function() {
        return this.hasMany('EventUser', 'eventId')
    }
});

module.exports = bookshelf.model('Event', event);