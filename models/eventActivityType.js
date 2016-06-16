'use strict';

const bookshelf = require('../db/bookshelf');

var eventActivityType = bookshelf.Model.extend({
    tableName: 'eventActivityType',
    visible: ['id', 'name']
});

module.exports = bookshelf.model('EventActivityType', eventActivityType);