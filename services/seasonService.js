'use strict';

const _ = require('lodash');
const moment = require('moment');
const Bookshelf = require('../db/bookshelf');
const Season = require('../models/season');
const leagueService = require('../services/leagueService');
const EventActivityTypes = require('../models/eventActivityTypeValues');

module.exports = {
    get: getSeason,
    list: listSeasons,
    add: addSeason,
    update: updateSeason,
    delete: deleteSeason,
    getSeasonForActiveLeagueUser: getSeasonForActiveLeagueUser,
    getSeasonForActiveLeagueMember: getSeasonForActiveLeagueMember
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
            .innerJoin('leagueMember', function () {
                this.on('league.id', '=', 'leagueMember.leagueId')
                    .andOn('leagueMember.userId', '=', user.id)
            })
            .where('season.isDeleted', false)
            .andWhere('league.isDeleted', false)
            .andWhere('leagueMember.isDeleted', false)
            .andWhere('leagueMember.isActive', true)
        })
        .fetch({withRelated: ['league']})
        .then(_queryForRankings)
        .then(_queryForEvents)
        .then(_packageResults);

    function _queryForRankings(season) {
        return Bookshelf.knex
            .select('leagueMember.id', 'leagueMember.name')
            .sum('eventActivity.amount as winnings')
            .from('leagueMember')
            .innerJoin('league', 'leagueMember.leagueId', 'league.id')
            .innerJoin('season', 'league.id', 'season.leagueId')
            .innerJoin('event', 'season.id', 'event.seasonId')
            .innerJoin('eventActivity', function () {
                this.on('event.id', '=', 'eventActivity.eventId')
                    .andOn('leagueMember.id', '=', 'eventActivity.leagueMemberId')
            })
            .where('season.id', season.get('id'))
            .andWhere('eventActivity.eventActivityTypeId', EventActivityTypes.FINAL_RESULT)
            .andWhere('leagueMember.isActive', true)
            .groupBy('leagueMember.id')
            .orderBy('winnings', 'desc')
            .then(rankings => {
                return [season, rankings]
            });
    }

    function _queryForEvents(seasonAndRankings) {
        var [season, rankings] = seasonAndRankings;

        var subselect = Bookshelf.knex
            .select('event.id', 'leagueMember.id as leagueMemberId', 'leagueMember.name as leagueMemberName')
            .sum('eventActivity.amount as winnings')
            .from('event')
            .innerJoin('eventActivity', function () {
                this.on('event.id', '=', 'eventActivity.eventId')
                    .andOn('eventActivity.eventActivityTypeId', '=', EventActivityTypes.FINAL_RESULT)
            })
            .innerJoin('leagueMember', 'eventActivity.leagueMemberId', 'leagueMember.id')
            .where('event.seasonId', season.get('id'))
            .groupBy('event.id', 'leagueMember.id')
            .orderBy('winnings', 'desc');

        return Bookshelf.knex
            .select('event.id', 'event.seasonId', 'event.eventDate', 'leagueMember.name as hostName',
                'a.leagueMemberName as firstPlaceWinner',
                'a.winnings as firstPlaceWinnings')
            .from('event')
            .innerJoin('leagueMember', 'event.hostMemberId', 'leagueMember.id')
            .leftJoin(subselect.clone().as('a'), function() {
                this.on('event.id', '=', 'a.id')
            })
            .leftJoin(subselect.clone().as('b'), function() {
                this.on('a.id', '=', 'b.id')
                    .andOn('a.winnings', '<', 'b.winnings')
            })
            .whereNull('b.winnings')
            .andWhere('event.seasonId', season.get('id'))
            .orderBy('event.eventDate', 'asc')
            .then(events => {
                return [season, rankings, events]
            });
    }

    function _packageResults(results) {
        var [seasonRow, rankingsRows, eventRows] = results;
        var season = seasonRow.serialize();
        season.rankings = marshallRankings(rankingsRows);
        season.events = marshallEvents(eventRows);
        return season;
    }
}

function listSeasons(user) {
    return leagueService.getActiveLeagueMember(user)
        .then(_listSeasons);

    function _listSeasons(leagueMember) {
        var subselect = Bookshelf.knex
            .select('season.id', 'leagueMember.id as leagueMemberId', 'leagueMember.name as leagueMemberName')
            .sum('eventActivity.amount as winnings')
            .from('season')
            .innerJoin('event', 'season.id', 'event.seasonId')
            .innerJoin('eventActivity', function () {
                this.on('event.id', '=', 'eventActivity.eventId')
                    .andOn('eventActivity.eventActivityTypeId', '=', EventActivityTypes.FINAL_RESULT)
            })
            .innerJoin('leagueMember', 'eventActivity.leagueMemberId', 'leagueMember.id')
            .where('season.leagueId', leagueMember.get('leagueId'))
            .groupBy('season.id', 'leagueMember.id')
            .orderBy('winnings', 'desc');


        return Season.query(function(q) {
            q.column('season.id', 'season.year', 'season.isActive',
                    'a.leagueMemberId as firstPlaceLeagueMemberId',
                    'a.leagueMemberName as firstPlaceLeagueMemberName',
                    'a.winnings as firstPlaceWinnings')
                .leftJoin(subselect.clone().as('a'), function() {
                    this.on('season.id', '=', 'a.id')
                })
                .leftJoin(subselect.clone().as('b'), function() {
                    this.on('a.id', '=', 'b.id')
                        .andOn('a.winnings', '<', 'b.winnings')
                })
                .whereNull('b.winnings')
                .andWhere('season.leagueId', leagueMember.get('leagueId'));
        })
        .orderBy('season.year', 'desc')
        .fetchAll();
    }
}

function addSeason(user, year, isActive) {
    return leagueService.getActiveLeagueMember(user)
        .then(_save);

    function _save(leagueMember) {
        return new Season({
                leagueId: leagueMember.get('leagueId'),
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
    return getSeasonForActiveLeagueMember(seasonId, user.id)
        .then(season => {
            if (season) {
                return Delete(seasonId);
            } else {
                return null;
            }
        });

    function Delete(seasonId) {
        return _getSeason()
            .then(_updateSeason)
            .then(_updateActiveSeason);

        function _getSeason() {
            return Season.forge({id: seasonId}).fetch();
        }

        function _updateSeason(season) {
            season.set('isDeleted', true);
            season.set('isActive', false);
            return season.save();
        }

        function _updateActiveSeason(season) {
            if (season.get('isActive')) {
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
        }
    }
}

function getSeasonForActiveLeagueMember(seasonId, leagueMemberId) {
    return Season.forge({id: seasonId}).query(function (q) {
            q.innerJoin('league', function () {
                this.on('season.leagueId', '=', 'league.id')
            })
            .innerJoin('leagueMember', function () {
                this.on('league.id', '=', 'leagueMember.leagueId')
                    .andOn('leagueMember.id', '=', leagueMemberId)
            })
            .where('season.isDeleted', false)
            .andWhere('league.isDeleted', false)
            .andWhere('leagueMember.isDeleted', false)
            .andWhere('leagueMember.isActive', true)
    })
    .fetch();
}

function getSeasonForActiveLeagueUser(seasonId, userId) {
    return Season.forge({id: seasonId}).query(function (q) {
        q.innerJoin('league', function () {
            this.on('season.leagueId', '=', 'league.id')
        })
            .innerJoin('leagueMember', function () {
                this.on('league.id', '=', 'leagueMember.leagueId')
                    .andOn('leagueMember.userId', '=', userId)
            })
            .where('season.isDeleted', false)
            .andWhere('league.isDeleted', false)
            .andWhere('leagueMember.isDeleted', false)
            .andWhere('leagueMember.isActive', true)
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

function marshallEvents(events) {
    if (events == undefined) return;
    var out = [];
    _(events).each(function (event) {
        out.push({
            id: event.id,
            seasonId: event.seasonId,
            eventDate: moment(event.eventDate).format('YYYY-MM-DDTHH:mm'),
            hostName: event.hostName,
            firstPlaceWinner: event.firstPlaceWinner,
            firstPlaceWinnings: event.firstPlaceWinnings
        });
    });
    return out;
}