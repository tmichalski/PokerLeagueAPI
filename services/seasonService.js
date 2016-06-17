'use strict';

const _ = require('lodash');
const Bookshelf = require('../db/bookshelf');
const Season = require('../models/season');
const leagueService = require('../services/leagueService');
const EventActivityTypes = require('../models/eventActivityTypeValues');

module.exports = {
    get: getSeason,
    list: listSeasons,
    add: addSeason,
    update: updateSeason,
    delete: deleteSeason
};

///////////////

function getSeason(user, seasonId) {
    var params = {'id': seasonId};
    if ('latest' == seasonId) {
        params = {'isActive': true};
    }

    return Season.forge(params).query(function (q) {
            q.innerJoin('league', function () {
                this.on('season.leagueId', '=', 'league.id')
            })
            .innerJoin('leagueUser', function () {
                this.on('league.id', '=', 'leagueUser.leagueId')
                    .andOn('leagueUser.userId', '=', user.id)
            })
            .where('season.isDeleted', false)
            .andWhere('league.isDeleted', false)
            .andWhere('leagueUser.isDeleted', false)
            .andWhere('leagueUser.isActive', true)
        })
        .fetch({withRelated: ['firstPlaceUser', 'events.hostUser', 'league']})
        .then(_queryForRankings)
        .then(_packageResults);

    function _queryForRankings(season) {
        return Bookshelf.knex.select('user.*').sum('eventActivity.amount as winnings')
            .from('eventActivity')
            .innerJoin('user', 'eventActivity.userId', 'user.id')
            .innerJoin('event', 'eventActivity.eventId', 'event.id')
            .innerJoin('season', 'event.seasonId', 'season.id')
            .where('season.id', season.get('id'))
            .andWhere('eventActivity.eventActivityTypeId', EventActivityTypes.FINAL_RESULT)
            .groupBy('eventActivity.userId')
            .orderBy('winnings', 'desc')
            .then(rankings => {
                return [season, rankings]
            });
    }

    function _packageResults(seasonAndRankingsArray) {
        var [seasonRow, rankingsRows] = seasonAndRankingsArray;
        var season = seasonRow.serialize();
        season.rankings = marshallRankings(rankingsRows);
        return season;
    }
}

function listSeasons(user) {
    return Season.query(function (q) {
            q.innerJoin('league', function () {
                this.on('season.leagueId', '=', 'league.id')
            })
            .innerJoin('leagueUser', function () {
                this.on('league.id', '=', 'leagueUser.leagueId')
                    .andOn('leagueUser.userId', '=', user.id)
            })
            .where('season.isDeleted', false)
            .andWhere('league.isDeleted', false)
            .andWhere('leagueUser.isDeleted', false)
            .andWhere('leagueUser.isActive', true)
        })
        .orderBy('year', 'DESC')
        .fetchAll({withRelated: ['firstPlaceUser']});
}

function addSeason(user, year, isActive) {
    return leagueService.getActiveLeague(user)
        .then(leagueUser => {
            if (leagueUser) {
                return _save(leagueUser.leagueId, year, isActive);
            } else {
                return null;
            }
        });

    function _save(leagueId, year, isActive) {
        return new Season({
                leagueId: leagueId,
                year: year,
                isActive: isActive || false
            })
            .save()
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
            .save({year: year, isActive: isActive})
            .then(function () {
                if (isActive) {
                    Bookshelf.knex.raw('UPDATE season SET isActive = false WHERE id != ?', [seasonId])
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
                return Delete(seasonId);
            } else {
                return null;
            }
        });

    function Delete(seasonId) {
        return Season.forge({id: seasonId})
            .save({isDeleted: true, isActive: false})
            .then(function (season) {
                // If the season was active, then find the highest not deleted year value and set that as active.
                if (isActive) {
                    Bookshelf.knex.raw(
                        'UPDATE season SET isActive = true ' +
                        'WHERE id != ? AND isDeleted = false AND year = (SELECT MAX(year) FROM season)', [seasonId])
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
                this.on('season.leagueId', '=', 'league.id')
            })
            .innerJoin('leagueUser', function () {
                this.on('league.id', '=', 'leagueUser.leagueId')
                    .andOn('leagueUser.userId', '=', userId)
            })
            .where('season.isDeleted', false)
            .andWhere('league.isDeleted', false)
            .andWhere('leagueUser.isDeleted', false)
            .andWhere('leagueUser.isActive', true)
    })
    .fetch();
}

function marshallRankings(ranking) {
    if (ranking == undefined) return;
    var out = [];
    _(ranking).each(function (rank, i) {
        out.push({
            rank: i + 1,
            user: {
                id: rank.id,
                name: rank.name
            },
            winnings: rank.winnings
        });
    });
    return out;
}