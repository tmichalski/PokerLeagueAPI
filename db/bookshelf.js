'use strict';

const knex = require('./knex');

const bookshelf = require('bookshelf')(knex);
bookshelf.plugin('visibility');
bookshelf.plugin('registry');

module.exports = bookshelf;

// Initialize all of the Bookshelf models right away so that all dependencies resolve. 
require('../models/_init');