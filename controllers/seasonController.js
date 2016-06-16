'use strict';

const seasonService = require('../services/seasonService');

module.exports = {
    list: listSeasons,
    get: getSeason,
    add: addSeason,
    update: updateSeason,
    delete: deleteSeason
};

///////////////

function listSeasons(req, res) {
    seasonService.list(req.user)
        .then(seasons => res.json(seasons));
}

function getSeason(req, res) {
    seasonService.get(req.user, req.params.id)
        .then(season => res.json(season));
}

function addSeason(req, res) {
    seasonService.add(req.user, req.body.year, req.body.isActive)
        .then(season => res.json(season));
}

function updateSeason(req, res) {
    seasonService.update(req.user, req.params.id, req.body.year, req.body.isActive)
        .then(season => res.json(season));
}

function deleteSeason(req, res) {
    seasonService.delete(req.user, req.params.id)
        .then(season => res.json(season));
}