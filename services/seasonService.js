'use strict';

const _ = require('lodash');
const Bookshelf = require('../db/bookshelf');
const Season = require('../models/season');
const leagueService = require('../services/leagueService');

module.exports = {
    get: getSeason,
    list: listSeasons,
    add: addSeason,
    update: updateSeason,
    delete: deleteSeason
};

function getSeason(user, seasonId) {
    var params = {'id': seasonId};
    if ('latest' == seasonId) {
        params = {'is_active': true};
    }

    return Season.forge(params).query(function (q) {
            q.innerJoin('league', function () {
                this.on('season.league_id', '=', 'league.id')
            })
            .innerJoin('league_user', function () {
                this.on('league.id', '=', 'league_user.league_id')
                    .andOn('league_user.user_id', '=', user.id)
            })
            .where('season.is_deleted', false)
            .andWhere('league.is_deleted', false)
            .andWhere('league_user.is_deleted', false)
            .andWhere('league_user.is_active', true)
        })
        .fetch({withRelated: ['firstPlaceUser', 'events.hostUser']})
        .then(_queryForRankings)
        .then(_packageResults);

    function _queryForRankings(season) {
        return Bookshelf.knex.select('user.*').sum('event_result.amount as winnings')
            .from('event_result')
            .innerJoin('user', 'event_result.user_id', 'user.id')
            .innerJoin('event', 'event_result.event_id', 'event.id')
            .innerJoin('season', 'event.season_id', 'season.id')
            .where('season.id', season.get('id'))
            .groupBy('event_result.user_id')
            .orderBy('winnings', 'desc')
            .then(rankings => {
                return [season, rankings]
            });
    }

    function _packageResults(seasonAndRankingsArray) {
        var [seasonRow, rankingsRows] = seasonAndRankingsArray;
        var season = marshallSeason(seasonRow);
        season.rankings = marshallRankings(rankingsRows);
        return season;
    }
}

function listSeasons(user) {
    return Season.query(function (q) {
            q.innerJoin('league', function () {
                this.on('season.league_id', '=', 'league.id')
            })
            .innerJoin('league_user', function () {
                this.on('league.id', '=', 'league_user.league_id')
                    .andOn('league_user.user_id', '=', user.id)
            })
            .where('season.is_deleted', false)
            .andWhere('league.is_deleted', false)
            .andWhere('league_user.is_deleted', false)
            .andWhere('league_user.is_active', true)
        })
        .orderBy('year', 'DESC')
        .fetchAll({withRelated: ['firstPlaceUser']})
        .then(seasons => {
            return marshallSeasons(seasons);
        });
}

function addSeason(user, year, isActive) {
    return leagueService.getActiveLeague(user)
        .then(leagueUser => {
            if (leagueUser) {
                return _save(leagueUser.league_id, year, isActive);
            } else {
                return null;
            }
        });

    function _save(leagueId, year, isActive) {
        return new Season({
                league_id: leagueId,
                year: year,
                is_active: isActive || false
            })
            .save()
            .then(season => {
                return marshallSeason(season);
            })
    }
}

function updateSeason(user, seasonId, year, isActive) {
    // TODO This could be combined into a single UPDATE statement that would both verify the season belonging to the user and update.
    return getSeasonForActiveLeagueUser(seasonId, user.id)
        .then(season => {
            if (season) {
                return _save(seasonId, year, isActive);
            } else {
                return null;
            }
        });

    function _save(seasonId, year, isActive) {
        return Season.forge({id: seasonId})
            .save({year: year, is_active: isActive})
            .then(function () {
                if (isActive) {
                    Bookshelf.knex.raw('UPDATE season SET is_active = false WHERE id != ?', [seasonId])
                        .then(function (resp) {
                            // Do nothing
                        })
                        .catch(function (err) {
                            console.log("SQL Raw error: ");
                            console.log(err.stack);
                        });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

function deleteSeason(user, seasonId) {
    // TODO This could be combined into a single UPDATE statement that would both verify the season belonging to the user and update.
    return getSeasonForActiveLeagueUser(seasonId, user.id)
        .then(season => {
            if (season) {
                return _delete(seasonId);
            } else {
                return null;
            }
        });

    function _delete(seasonId) {
        return Season.forge({id: seasonId})
            .save({is_deleted: true, is_active: false})
            .then(function (season) {
                // If the season was active, then find the highest not deleted year value and set that as active.
                if (isActive) {
                    Bookshelf.knex.raw(
                        'UPDATE season SET is_active = true ' +
                        'WHERE id != ? AND is_deleted = false AND year = (SELECT MAX(year) FROM season)', [seasonId])
                        .then(function (resp) {
                            // Do nothing to invoke the raw statement
                        })
                        .catch(function (err) {
                            console.log("SQL Raw error: ");
                            console.log(err.stack);
                        });
                }
            });
    }
}

function getSeasonForActiveLeagueUser(seasonId, userId) {
    return Season.forge({id: seasonId}).query(function (q) {
            q.innerJoin('league', function () {
                this.on('season.league_id', '=', 'league.id')
            })
            .innerJoin('league_user', function () {
                this.on('league.id', '=', 'league_user.league_id')
                    .andOn('league_user.user_id', '=', userId)
            })
            .where('season.is_deleted', false)
            .andWhere('league.is_deleted', false)
            .andWhere('league_user.is_deleted', false)
            .andWhere('league_user.is_active', true)
    })
    .fetch();
}

function marshallSeasons(seasons) {
    var out = [];
    _(seasons.models).each(function (season) {
        out.push(marshallSeason(season));
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
    _(events).each(event => {
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
    _(ranking).each(function (rank, i) {
        out.push({
            rank: i + 1,
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