const cors = require('cors');
const bodyParser = require('body-parser');

const routeHandlers = function routeHandlers(app) {

    // Globally allow Cross Object Resource Sharing on all endpoints
    app.use(cors());

    // Handle POST body parsing
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    
    // Echo interceptor
    app.use(function(req, res, next) {
        console.log('Processing request: ' + req.originalUrl);
        next();
    });
    
};

module.exports = routeHandlers;