'use strict';

const memberService = require('../services/memberService');

module.exports = {
    list: list,
    get: get,
    add: add,
    update: update,
    delete: deleteMember
};

///////////////

function list(req, res) {
    memberService.list(req.user).then(function (members) {
        res.json(members);
    })
}

function get(req, res) {
    memberService.getWithRankings(req.user, req.params.id).then(function (member) {
        res.json(member);
    });
}

function add(req, res) {
    memberService.add(req.user, req.body.name, req.body.email, req.body.isAdmin).then(function (member) {
        res.json(member);
    });
}

function update(req, res) {
    memberService.update(req.user, req.body.id, req.body.name, req.body.email, req.body.isActive, req.body.isAdmin).then(function (member) {
        res.json(member);
    });
}

function deleteMember(req, res) {
    memberService.delete(req.user, req.params.id).then(function (member) {
        res.json(member);
    });
}