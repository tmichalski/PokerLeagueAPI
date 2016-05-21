'use strict';

const express = require('express');
const router = express.Router();

const Event = require('../models/event');

router.get('/schedule/:year', function(req, res) {
    Event.fetchAll().then(function(events) {
        res.json(eventss);
    });
});


module.exports = router;