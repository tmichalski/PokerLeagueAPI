'use strict';

const bookshelf = require('../db/bookshelf');

var user = bookshelf.Model.extend({
    tableName: 'user',
    visible: ['id', 'name', 'email', 'isLeagueAdmin']  // isLeagueAdmin is not an actual db field, but a merge of LeagueUser details
});

module.exports = bookshelf.model('User', user);