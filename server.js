'use strict';

const express = require('express');

const app = express();
const port = 8080;

require('./config/routeHandlers')(app);

require('./config/routes')(app);

console.log('-----------------------------------');
console.log('\u2662 Poker League API v' + getVersion());
console.log('-----------------------------------');

app.listen(port);
console.log('Listening on port ' + port);


function getVersion() {
    var packageJson = require('./package.json');
    return packageJson.version;
}