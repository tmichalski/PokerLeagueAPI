const passportService = require('../services/passportService');
const leagueService = require('../services/leagueService');
const userController = require('../controllers/userController');
const seasonController = require('../controllers/seasonController');
const loginController = require('../controllers/loginController');

const apiRoutes = function apiRoutes(app) {

    var authFilters = [passportService.auth(), leagueService.hasActiveLeague];

    // Default
    app.get('/', function(req, res) {
        res.json({ message: 'Poker League API' });
    });

    // Login
    app.post('/login', loginController.login);

    // Users
    app.get('/users',           authFilters,            userController.list);
    app.use('/users/:id',       authFilters,            userController.get);

    // Seasons
    app.get('/seasons',         authFilters,     seasonController.list);
    app.post('/seasons',        authFilters,     seasonController.add);
    app.get('/seasons/:id',     authFilters,     seasonController.get);
    app.post('/seasons/:id',    authFilters,     seasonController.update);
    app.delete('/seasons/:id',  authFilters,     seasonController.delete);

};

module.exports = apiRoutes;