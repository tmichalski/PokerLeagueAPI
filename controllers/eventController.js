'use strict';

const eventService = require('../services/eventService');

module.exports = {
    get: getEvent
};

///////////////

function getEvent(req, res) {
    eventService.getEvent(req.user, req.params.id)
        .then(event => {
            res.json(event);
        });
}