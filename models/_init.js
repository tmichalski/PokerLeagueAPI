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
require('./eventActivityTypeValues');
require('./eventUser');

require('./league');
require('./leagueMember');

require('./season');

require('./user');