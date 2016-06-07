'use strict';

const bookshelf = require('../db/bookshelf');
const League = require('./league');
const User = require('./user');

module.exports = bookshelf.Model.extend({
    tableName: 'league_user',

    league: function() {
        return this.belongsTo(League);
    },

    user: function() {
        return this.belongsTo(User);
    }

});