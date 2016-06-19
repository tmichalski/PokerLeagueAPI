'use strict';

const env = process.env.NODE_ENV || 'development';
const dbConfig = require('./knexfile')[env];
const knex = require('knex')(dbConfig);

const bookshelf = require('bookshelf')(knex);
bookshelf.plugin('visibility');
bookshelf.plugin('registry');

module.exports = bookshelf;

// Initialize all of the Bookshelf models right away so that all dependencies resolve. 
require('../models/_init');