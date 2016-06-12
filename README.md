# PokerLeagueAPI
Web services API for the PokerLeague mobile app.

## Coding Standards
Following the coding standards for the following core frameworks of this app. 
* [NodeJS](https://nodejs.org/en/) - Javscript Engine
* [ExpressJS](http://expressjs.com) - HTTP Server
* [Bluebird](https://github.com/petkaantonov/bluebird) - Promise API
* [BookshelfJS](http://bookshelfjs.org) - DB ORM (build on Knex)
* [KnexJS](http://knexjs.org) - SQL Builder API

Read up on Promise Anti-Patterns (AND AVOID THESE!)
* Google: https://www.google.com/#q=javascript+promise+anti+patterns
* http://taoofcode.net/promise-anti-patterns/

## Developer Setup
### Setup Env

Install [Node Package Manager (npm)](https://www.npmjs.com)

Clone the PokerLeagueAPI project locally (assumes you already have [git installed](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git))
> ```$ cd /my/workspace```

> ```$ git clone https://github.com/tmichalski/PokerLeagueAPI.git```

> ```$ cd /my/workspace/PokerLeagueAPI```

Install app dependencies
> ```$ npm install```

Install [Nodemon](http://nodemon.io) for live reload
> ```$ npm install -g nodemon```

### Run App
Be sure the PokerLeagueAPI app is running and listening on whatever hostname:port is configured in /www/app/app.config.js

## App Config
* Application config params are stored in */www/app/app.config.js*
* serverHostName: Sets the web services hostname and port. Default is *http://pokerleague.lssinc.com:8080*

### IDE: JetBrains WebStorm / IntelliJ IDEA
* IntellJ IDE > Preferences > Plugins > Browse Repositories...  and install the following plugins:
  * PhoneGap/Cordova
  * AngularJS
* Run > Edit Configurations
  * Click the "+" sign to add a new configuration
  * Choose "PhoneGap/Cordova" from the "+" drop-down list
  * Enter the following options
    * Name: Emulate Browser
    * PhoneGap/Cordova executable: /usr/local/bin/ionic
    * PhoneGap/Cordova working directory: <path to your project> (ie /Users/tim/Documents/workspace/PokerLeague)
    * Command: emulate
    * Platform: browser
  * Click "Ok" to save
  * Repeat this setup for each platform by changing the "Name" and "Platform" variables.
* In the "Run" drop-down list in the main toolbar, select your run option and click the green "Play" button to launch the app. 
  * Be sure the PokerLeagueAPI app is running and listening on whatever hostname:port is configured in */www/app/app.config.js*

## Database
The database tables/seed migration scripts rely on the Knex API. Install the Knex command line npm module
before executing the following commands.
```npm install -g knex```

Run all database commands within this section from the <project workspace>/db folder in terminal.
```cd <project workspace>```
```cd db```

### Generate tables
```knex migrate:latest```

### Load seed data for testing
```knex seed:run```

### Drop Tables
```knex migrate:rollback```

