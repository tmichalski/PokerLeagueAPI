'use strict';

const JWT = require('jwt-async');
const Promise = require('bluebird');
const jwt = Promise.promisifyAll(new JWT());
const jwtConfig = require('../config/jwt');
jwt.setSecret(jwtConfig.secret);

const passport = require('../config/passport');

module.exports = {
    auth: auth,
    generateToken: generateToken
};

///////////////

function auth() {
    return passport.authenticate('jwt', {session: false});
}

function generateToken(user) {
    return jwt.signAsync(user).then(token => 'JWT ' + token);
}