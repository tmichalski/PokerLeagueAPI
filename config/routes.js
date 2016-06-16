const passportService = require('../services/passportService');
const leagueService = require('../services/leagueService');

const loginController = require('../controllers/loginController');
const leagueController = require('../controllers/leagueController');
const seasonController = require('../controllers/seasonController');
const eventController = require('../controllers/eventController');
const userController = require('../controllers/userController');

const apiRoutes = function apiRoutes(app) {
    var authFilter = passportService.auth();
    var leagueFilter = leagueService.hasActiveLeague;
    var requestFilters = [authFilter, leagueFilter];

    // Default
    app.get('/', function(req, res) {
        res.json({ message: 'Poker League API' });
    });

    // Login
    app.post('/login', loginController.login);

    // Users
    app.get('/users',               requestFilters,     userController.list);
    app.get('/users/:id',           requestFilters,     userController.get);

    // League
    app.post('/league/join',        authFilter,         leagueController.join);
    app.post('/league/leave',       authFilter,         leagueController.leave);

    // Seasons
    app.get('/seasons',             requestFilters,     seasonController.list);
    app.post('/seasons',            requestFilters,     seasonController.add);
    app.get('/seasons/:id',         requestFilters,     seasonController.get);
    app.post('/seasons/:id',        requestFilters,     seasonController.update);
    app.delete('/seasons/:id',      requestFilters,     seasonController.delete);

    // Events
    app.get('/events/:id',          requestFilters,     eventController.get);

};

module.exports = apiRoutes;