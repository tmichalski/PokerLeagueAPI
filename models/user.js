'use strict';

const bookshelf = require('../db/bookshelf');

var user = bookshelf.Model.extend({
    tableName: 'user',

    visible: ['id', 'name', 'email']
});

module.exports = bookshelf.model('User', user);