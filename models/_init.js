/**
 * Bookshelf "Registry" plugin allows for models to be pre-loaded so that circular dependencies will reference
 * instances instead of re-requiring new model object and causing a fuss. All objects need to be required once before
 * they are used anywhere else in the app.
 *
 * Called by /db/bookshelf.js
 **/

require('./event');
require('./eventActivity');
require('./eventActivityType');
require('./eventUser');

require('./league');
require('./leagueUser');

require('./season');

require('./user');