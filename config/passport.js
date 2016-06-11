'use strict';

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtConfig = require('./jwt');
const userService = require('../services/userService');

passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
        secretOrKey: jwtConfig.secret
    },
    function (jwt_payload, done) {
        userService.getByUserId(jwt_payload.id)
            .then(user => user ? done(null, user) : done(null, false))
            .catch(error => done(err, false));
    })
);

module.exports = passport;
