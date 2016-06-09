'use strict';

const bookshelf = require('../db/bookshelf');

var user = bookshelf.Model.extend({
    tableName: 'user'
});

module.exports = bookshelf.model('User', user);