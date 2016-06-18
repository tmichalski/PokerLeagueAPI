'use strict';

const eventService = require('../services/eventService');

module.exports = {
    get: getEvent,
    users: getEventUsers,
    activities: getEventActivities
};

///////////////

function getEvent(req, res) {
    eventService.getEvent(req.user, req.params.id)
        .then(event => {
            res.json(event);
        });
}

function getEventUsers(req, res) {
    eventService.getEventUsers(req.user, req.params.id)
        .then(eventUsers => {
            res.json(eventUsers);
        });
}

function getEventActivities(req, res) {
    eventService.getEventActivities(req.user, req.params.id)
        .then(eventActivities => {
            res.json(eventActivities);
        });
}