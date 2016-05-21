'use strict';

const _ = require('lodash');
const Bookshelf = require('../db/bookshelf');
const Season = require('../models/season');

var controller = {

    listAll: function(req, res) {
        Season.fetchAll({withRelated: ['firstPlaceUser']}).then(function (seasons) {
            var out = marshallSeasons(seasons);
            res.json( out );
        })
    },

    get: function(req, res) {
        var id = req.params.id;
        if ('latest' == id) {
            id = 1;
        }

        Season.forge({'id': id}).fetch({withRelated: ['firstPlaceUser', 'events.hostUser']}).then(function(season) {
            var out = marshallSeason(season);

            var knex = Bookshelf.knex;
            knex.select('user.*').sum('event_result.amount as winnings')
                .from('event_result')
                .innerJoin('user', 'event_result.user_id', 'user.id')
                .innerJoin('event', 'event_result.event_id', 'event.id')
                .innerJoin('season', 'event.season_id', 'season.id')
                .where('season.id', season.get('id'))
                .groupBy('event_result.user_id')
                .orderBy('winnings', 'desc')
                .then(function(rows) {
                    out.rankings = marshallRanking(rows);
                    res.json( out );
                });
        });
    }
};

function marshallSeasons(seasons) {
    var out = [];
    _(seasons.models).each(function(season) {
        out.push( marshallSeason(season) );
    });
    return out;
}

function marshallSeason(season) {
    return {
        id: season.get('id'),
        year: season.get('year'),
        isActive: season.get('is_active') ? true : false,
        firstPlaceUser: marshallUser(season.related('firstPlaceUser')),
        firstPlaceWinnings: season.get('first_place_winnings'),
        events: marshallEvents(season.related('events').models)
    };
}

function marshallEvents(events) {
    if (events.length == 0) return;
    var out = [];
    _(events).each(function(event) {
        out.push(marshallEvent(event));
    });
    return out;
}

function marshallEvent(event) {
    if (!event.has('id')) return;
    return {
        id: event.get('id'),
        name: event.get('name'),
        eventDate: event.get('event_date'),
        hostUser: marshallUser(event.related('hostUser'))
    };
}

function marshallUser(user) {
    if (!user.has('id')) return;
    return {
        id: user.get('id'),
        nickname: user.get('nickname'),
        fullName: user.get('full_name'),
        isVisitor: user.get('is_visitor') ? true : false
    }
}

function marshallRanking(ranking) {
    if (ranking == undefined) return;
    var out = [];
    _(ranking).each(function(rank, i) {
        out.push({
            rank: i+1,
            user: {
                id: rank.id,
                nickname: rank.nickname,
                fullName: rank.full_name,
                isVisitor: !!rank.is_visitor
            },
            winnings: rank.winnings
        });
    });
    return out;
}

module.exports = controller;