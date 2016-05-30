'use strict';

const _ = require('lodash');
const Bookshelf = require('../db/bookshelf');
const Season = require('../models/season');

const controller = {
    list(req, res) {
        Season.forge().where({is_deleted: false}).orderBy('year', 'DESC').fetchAll({withRelated: ['firstPlaceUser']})
            .then(function (seasons) {
                var out = marshallSeasons(seasons);
                res.json( out );
            })
            .catch(function (error) {
                console.log(error);
                res.send('An error occurred');
            });
    },

    get(req, res) {
        var id = req.params.id;
        fetchSeason(id)
            .then(queryForRankings)
            .then(processGetResults)
            .then(out => res.json(out));
    },

    add(req, res) {
        new Season({
            year: req.body.year,
            is_active: req.body.isActive || false
        }).save().then(function(season) {
            var out = marshallSeason(season);
            res.json( out )
        }).catch(function (error) {
            console.log(error);
            res.send('An error occurred');
        });
    },

    update(req, res) {
        var id = req.params.id;
        var year = req.body.year;
        var isActive = req.body.isActive;

        Season.forge({id: id})
            .save({year: year, is_active: isActive})
            .then(out => res.json(out))
            .catch(function (error) {
                console.log(error);
                res.send('An error occurred');
            });

        if (isActive) {
            Bookshelf.knex.raw('UPDATE season SET is_active = false WHERE id != ?', [id])
                .then(function(resp) {
                    // Do nothing
                })
                .catch(function(err) {
                    console.log("SQL Raw error: ");
                    console.log(err.stack);
                });
        }
    },

    delete(req, res) {
        var id = req.params.id;
        var isActive = req.body.isActive;

        Season.forge({id: id})
            .save({is_deleted: true, is_active: false})
            .then(out => res.json(out));

        // If the season was active, then find the highest not deleted year value and set that as active.
        if (isActive) {
            Bookshelf.knex.raw(
                'UPDATE season SET is_active = true ' +
                'WHERE id != ? AND is_deleted = false AND year = (SELECT MAX(year) FROM season)', [id])
            .then(function(resp) {
                // Do nothing
            })
            .catch(function(err) {
                console.log("SQL Raw error: ");
                console.log(err.stack);
            });
        }
    }
};

function fetchSeason(id) {
    var query = {'id': id, is_deleted: false};
    if ('latest' == id) {
        query = {'is_active': true, is_deleted: false};
    }
    return Season.forge(query).fetch({withRelated: ['firstPlaceUser', 'events.hostUser']});
}

function queryForRankings(season) {
    return Bookshelf.knex.select('user.*').sum('event_result.amount as winnings')
        .from('event_result')
        .innerJoin('user', 'event_result.user_id', 'user.id')
        .innerJoin('event', 'event_result.event_id', 'event.id')
        .innerJoin('season', 'event.season_id', 'season.id')
        .where('season.id', season.get('id'))
        .groupBy('event_result.user_id')
        .orderBy('winnings', 'desc')
        .then(function(rankings) {
            return [season, rankings]
        });
}

function processGetResults(seasonAndRankingsArray) {
    const [seasonRow, rankingsRows] = seasonAndRankingsArray;
    const out = marshallSeason(seasonRow);
    out.rankings = marshallRankings(rankingsRows);
    return out;
}

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

function marshallRankings(ranking) {
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
