# PokerLeagueAPI
Web services API for the PokerLeague mobile app.

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

