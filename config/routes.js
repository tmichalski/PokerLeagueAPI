const passportService = require('../services/passportService');
const userController = require('../controllers/userController');
const seasonController = require('../controllers/seasonController');
const loginController = require('../controllers/loginController');

const apiRoutes = function apiRoutes(app) {

    // Default
    app.get('/', function(req, res) {
        res.json({ message: 'Poker League API' });
    });

    // Login
    app.post('/login', loginController.login);

    // Users
    app.get('/users',           passportService.auth(),     userController.list);
    //app.use('/users/:id', passportService.auth(),     userController.get);

    // Seasons
    app.get('/seasons',         passportService.auth(),     seasonController.list);
    app.post('/seasons',        passportService.auth(),     seasonController.add);
    app.get('/seasons/:id',     passportService.auth(),     seasonController.get);
    app.post('/seasons/:id',    passportService.auth(),     seasonController.update);
    app.delete('/seasons/:id',  passportService.auth(),     seasonController.delete);

};

module.exports = apiRoutes;