'use strict';

const bookshelf = require('../db/bookshelf');

module.exports = bookshelf.Model.extend({
    tableName: 'user'
});