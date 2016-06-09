'use strict';

const bookshelf = require('../db/bookshelf');

var event = bookshelf.Model.extend({
    tableName: 'event',

    season: function() {
        return this.belongsTo('Season');
    },

    hostUser: function() {
        return this.belongsTo('User', 'host_user_id');
    }
});

module.exports = bookshelf.model('Event', event);