'use strict';

const seasonService = require('../services/seasonService');

const controller = {
    list(req, res) {
        seasonService.list(req.user)
            .then(seasons => res.json(seasons));
    },

    get(req, res) {
        seasonService.get(req.user, req.params.id)
            .then(season => res.json(season));
    },

    add(req, res) {
        seasonService.add(req.user, req.body.year, req.body.isActive)
            .then(season => res.json(season));
    },

    update(req, res) {
        seasonService.update(req.user, req.params.id, req.body.year, req.body.isActive)
            .then(season => res.json(season));
    },

    delete(req, res) {
        seasonService.delete(req.user, req.params.id)
            .then(season => res.json(season));
    }
};

module.exports = controller;
