'use strict';

const Promise = require('bluebird');
const JWT = require('jwt-async');
const jwtConfig = require('../config/jwt');
const jwt = Promise.promisifyAll(new JWT());
jwt.setSecret(jwtConfig.secret);

const passport = require('../config/passport');

var service = {

    auth: function () {
        return passport.authenticate('jwt', {session: false});
    },

    generateToken: function(user) {
        return jwt.signAsync(user).then(token => 'JWT ' + token);
    }
};

module.exports = service;

