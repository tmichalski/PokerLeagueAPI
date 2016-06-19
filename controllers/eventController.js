'use strict';

const eventService = require('../services/eventService');

module.exports = {
    get: getEvent,
    users: getEventUsers,
    activities: getEventActivities,
    save: saveEventActivity,
    delete: deleteEventActivity
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

function saveEventActivity(req, res) {
    eventService.saveEventActivity(req.user, req.params.id, req.body)
        .then(eventActivity => {
            res.json(eventActivity)
        })
}

function deleteEventActivity(req, res) {
    eventService.deleteEventActivity(req.user, req.params.id, req.params.activityId)
        .then(response => {
            res.json(response)
        })
}