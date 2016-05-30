const passport = require('../config/passport');
const userController = require('../controllers/userController');
const seasonController = require('../controllers/seasonController');

const apiRoutes = function apiRoutes(app) {

    // Default
    app.get('/', function(req, res) {
        res.json({ message: 'Poker League API' });
    });

    // Users
    app.get('/users', userController.list);
    //app.use('/users/:id', userController.get);

    // Seasons
    app.get('/seasons', passport.authenticate('bearer', {session: false}), seasonController.list);
    app.post('/seasons', seasonController.add);
    app.get('/seasons/:id', seasonController.get);
    app.post('/seasons/:id', seasonController.update);
    app.delete('/seasons/:id', seasonController.delete);

};

module.exports = apiRoutes;