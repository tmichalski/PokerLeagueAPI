'use strict';

const dbConfig = require('./knexfile');
const knex = require('knex')(dbConfig);
const bookshelf = require('bookshelf')(knex);
bookshelf.plugin('visibility');

module.exports = bookshelf;