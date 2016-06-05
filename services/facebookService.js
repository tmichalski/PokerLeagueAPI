'use strict';
const facebookConfig = require('../config/facebook');
const passportService = require('./passportService');
const uuid = require('node-uuid');
const Promise = require('bluebird');
const url = require('url');
const request = Promise.promisify(require("request"));
const User = require('../models/user');

module.exports = {
    login
};

function login(shortLivedToken) {
    return doesAppIdInTokenMatchOurAppId(shortLivedToken)
        .then(getLongLivedTokenFromFacebook)
        .then(getUserInfoFromFacebook)
        .then(findOrCreateUser)
        .then(generateJwtToken)
}

function doesAppIdInTokenMatchOurAppId(shortLivedToken) {
    var verifyToken = "https://graph.facebook.com/debug_token?input_token=" + shortLivedToken +
        "&access_token=" + facebookConfig.appID + "|" + facebookConfig.secret;

    return request(verifyToken)
        .then(response => {
            const responseJson = JSON.parse(response.body);
            if (responseJson.error) throw new Promise.OperationalError(responseJson.error.message);
            if (responseJson.data.app_id != facebookConfig.appID) throw new Promise.OperationalError("App IDs do not match");
            return shortLivedToken;
        });
}

function getLongLivedTokenFromFacebook(shortLivedToken) {
    var exchangeToken = "https://graph.facebook.com/oauth/access_token?client_id=" + facebookConfig.appID +
        "&client_secret=" + facebookConfig.secret + "&grant_type=fb_exchange_token&fb_exchange_token=" + shortLivedToken;

    return request(exchangeToken)
        .then(response => {
            //Parsing the response string is due to the fact that if there are no errors facebook responds to oauth/access_token
            //with a query string-like format like so: access_token={long-term-token}&expires={expiration}
            //By adding '?' to the start of that string it can be parsed as query string
            const parsedResponseString = url.parse('?' + response.body, true).query;
            return parsedResponseString.access_token;
        });
}

function getUserInfoFromFacebook(longLivedToken) {
    return request('https://graph.facebook.com/me?fields=email,name&access_token=' + longLivedToken)
        .then(response => {
            const responseJson = JSON.parse(response.body);
            if (responseJson.error) throw new Promise.OperationalError(responseJson.error.message);
            const userInfo = responseJson;
            userInfo.longLivedToken = longLivedToken;
            return userInfo;
        });
}

function findOrCreateUser(userInfo) {
    return User.where('email', userInfo.email).fetch()
        .then(user => {
            if (user) {
                user.set('facebook_id', userInfo.id);
                user.set('facebook_token', userInfo.longLivedToken);
                return user.save().catch(function(error) { console.log(error) });
            } else {
                return User.forge({
                    email: userInfo.email,
                    //password: uuid.v1(),
                    name: userInfo.name,
                    facebook_id: userInfo.id,
                    facebook_token: userInfo.longLivedToken
                }).save().catch(function(error) { console.log(error) });
            }
        });
}

function generateJwtToken(user) {
    return passportService.generateToken(user);
}