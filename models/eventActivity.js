'use strict';

const bookshelf = require('../db/bookshelf');

var eventActivity = bookshelf.Model.extend({
    tableName: 'eventActivity',

    visible: ['id', 'note', 'amount', 'event', 'leagueMember', 'eventActivityType', 'createdDtm', 'createdByUser'],

    event: function() {
        return this.belongsTo('Event', 'eventId');
    },

    eventActivityType: function() {
        return this.belongsTo('EventActivityType', 'eventActivityTypeId');
    },

    leagueMember: function() {
        return this.belongsTo('LeagueMember', 'leagueMemberId');
    },

    createdByUser: function() {
        return this.belongsTo('User', 'createdByUserId');
    }

});

module.exports = bookshelf.model('EventActivity', eventActivity);