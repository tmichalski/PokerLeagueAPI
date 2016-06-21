'use strict';

const moment = require('moment');
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
    },

    toJSON: function () {
        var attrs = bookshelf.Model.prototype.toJSON.apply(this, arguments);
        attrs.eventDate = moment(this.get('eventDate')).format('YYYY-MM-DDTHH:mm');
        return attrs;
    }
});

module.exports = bookshelf.model('Event', event);