'use strict';

const bookshelf = require('../db/bookshelf');
const Season = require('./season');
const User = require('./user');

module.exports = bookshelf.Model.extend({
    tableName: 'event',

    season: function() {
        return this.belongsTo(Season);
    },

    hostUser: function() {
        return this.belongsTo(User, 'host_user_id');
    }
});