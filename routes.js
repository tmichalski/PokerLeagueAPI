const passportService = require('./services/passportService');
const leagueService = require('./services/leagueService');

const loginController = require('./controllers/loginController');
const leagueController = require('./controllers/leagueController');
const memberController = require('./controllers/memberController');
const seasonController = require('./controllers/seasonController');
const eventController = require('./controllers/eventController');
const userController = require('./controllers/userController');

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
    //app.post('/users',              requestFilters,     userController.add);
    app.get('/users/:id',           requestFilters,     userController.get);
    // app.post('/users/:id',          requestFilters,     userController.update);
    // app.delete('/users/:id',        requestFilters,     userController.delete);

    // League
    app.get('/league',              authFilter,         leagueController.getLeague);
    app.post('/league/join',        authFilter,         leagueController.join);
    app.post('/league/leave',       authFilter,         leagueController.leave);
    app.post('/league/create',      authFilter,         leagueController.create);

    // Members
    app.get('/members',             requestFilters,     memberController.list);
    app.post('/members',            requestFilters,     memberController.add);
    app.get('/members/:id',         requestFilters,     memberController.get);
    app.post('/members/:id',        requestFilters,     memberController.update);
    app.delete('/members/:id',      requestFilters,     memberController.delete);

    // Seasons
    app.get('/seasons',             requestFilters,     seasonController.list);
    app.post('/seasons',            requestFilters,     seasonController.add);
    app.get('/seasons/:id',         requestFilters,     seasonController.get);
    app.post('/seasons/:id',        requestFilters,     seasonController.update);
    app.delete('/seasons/:id',      requestFilters,     seasonController.delete);

    // Events
    app.get('/events/:id',              requestFilters,     eventController.get);
    app.post('/events',                 requestFilters,     eventController.save);
    app.post('/events/:id',             requestFilters,     eventController.save);
    app.get('/events/:id/members',        requestFilters,     eventController.members);
    app.get('/events/:id/activities',   requestFilters,     eventController.activities);
    app.post('/events/:id/activities',  requestFilters,     eventController.saveActivity);
    app.delete('/events/:id/activities/:activityId', requestFilters, eventController.deleteActivity);

};

module.exports = apiRoutes;