'use strict';

const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;

const userService = require('../services/userService');

// The Bearer strategy requires a `verify` function which receives the
// credentials (`token`) contained in the request.  The function must invoke
// `cb` with a user object, which will be set at `req.user` in route handlers
// after authentication.
passport.use(new BearerStrategy(
    function(token, done) {
        userService.getByToken(token)
            .then(user => {
                    if (!user) {
                        return done("No user found for the given token");
                    }

                    return done(null, user);
            })
    })
);


module.exports = passport;
