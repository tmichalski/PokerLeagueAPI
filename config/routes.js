const userController = require('../controllers/userController');
const seasonController = require('../controllers/seasonController');

const apiRoutes = function apiRoutes(app) {

    // Default
    app.get('/', function(req, res) {
        res.json({ message: 'Poker League API' });
    });

    // Users
    app.use('/users', userController.listAll);
    //app.use('/users/:id', userController.get);

    // Seasons
    app.use('/seasons/:id', seasonController.get);
    app.use('/seasons', seasonController.listAll);

};

module.exports = apiRoutes;