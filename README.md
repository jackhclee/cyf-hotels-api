# cyf-hotels-api
Example CYF Hotels API

## Prerequisities for macOS
1. [NodeJS version 16.15.1](https://nodejs.org/en/)
2. [Nodemon](https://www.npmjs.com/package//nodemon) 
3. Visual Studio Code
4. Visual Studio Code Extensions
   1. [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
   2. [SQLTools](https://vscode-sqltools.mteixeira.dev)
   3. [SQLTools PostgreSQL/Redshift Driver](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-pg)
   4. [SQL Formatter](https://marketplace.visualstudio.com/publishers/adpyke)
5. [PostgreSQL.app](https://github.com/PostgresApp/PostgresApp/releases/download/v2.5.7/Postgres-2.5.7-14.dmg)
6. [Postman](https://www.postman.com/)

### Database Instllation
1. Install VS Code and all PostgreSQL related extensions mentioned in above section
2. Download and install the PostgreSQL.app. Addl `psql` to `$PATH` by
   ```
    sudo mkdir -p /etc/paths.d &&
    echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp
   ```  
3. PostgreSQL.app trust all local connections by default. However, you can assign a password for a specific user as follows. To assign password for user `tom`:
   ```
   postgres=#\password tom
   Enter new password for user "tom": 
   Enter it again:
   ```
### Program Installation and execution
In terminal use `npm run dev` to run the server program and listening at port 3000. Change `server.js` to see result immediately.
```
$ git clone cyf-hotels-api
$ cd cyf-hotels-api
$ npm install
$ npm run dev
```

## Suggested Demonstrations
1. Comparison of database status before and after API call
2. SQL injection example. See the codes for different GET endpoint for `hotels` in the `server.js` 



