# cyf-hotels-api
Example CYF Hotels API

## Necessary Softwares for macOS
These tools should allow you change code, run SQL in one place. 
1. [NodeJS version 16.15.1](https://nodejs.org/en/)
2. [Nodemon](https://www.npmjs.com/package//nodemon) 
3. Visual Studio Code
4. Visual Studio Code Extensions
   1. [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
   2. [SQLTools](https://vscode-sqltools.mteixeira.dev)
   3. [SQLTools PostgreSQL/Redshift Driver](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-pg)
   4. [SQL Formatter](https://marketplace.visualstudio.com/publishers/adpyke)
   5. [Thuder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client)
5. [PostgreSQL.app](https://github.com/PostgresApp/PostgresApp/releases/download/v2.5.7/Postgres-2.5.7-14.dmg)
6. [Postman](https://www.postman.com/) (We taught trainee to use Postman before)

### Database Instllation
1. Install VS Code and all PostgreSQL related extensions mentioned in above section
2. Download and install the PostgreSQL.app. Add `psql` to `$PATH` by
   ```
    sudo mkdir -p /etc/paths.d &&
    echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp
   ```  
3. Start a new shell terminal
4. PostgreSQL.app trust all local connections by default. However, you can assign a password for a specific user as follows. To assign password for user `postgres`:
   ```
   postgres=#\password postgres
   Enter new password for user "postgres": 
   Enter it again:
   ```
5. Create database `cyf_hotels` and connect to this db
   ```
   postgres=#CREATE DATABASE cyf_hotels;
   postgres=# \c cyf_hotels
   You are now connected to database "cyf_hotels" as user "postgres".
   ```
6. Download and rename file [cyf_hotels_exercise5.sql](https://syllabus.codeyourfuture.io/assets/files/cyf_hotels_exercise5-88cc17362572ef85a70785dc2ceb21e9.sql) to `Downloads` folder and load it from psql
   ```
   cyf_hotels=#\i ~/Downloads/cyf_hotels_exercise5.sql
   ```
7. You should have 3 tables and following number of rows as shown in the following output in `cyf_hotels` db
   ```
   cyf_hotels=# \d
                List of relations
    Schema |       Name       |   Type   |  Owner
   --------+------------------+----------+----------
    public | bookings         | table    | postgres
    public | bookings_id_seq  | sequence | postgres
    public | customers        | table    | postgres
    public | customers_id_seq | sequence | postgres
    public | hotels           | table    | postgres
    public | hotels_id_seq    | sequence | postgres
    (6 rows)

   cyf_hotels=# select count(*) from hotels;
   count
   -------
     8
   (1 row)

   cyf_hotels=# select count(*) from customers;
   count
   -------
    10
   (1 row)

   cyf_hotels=# select count(*) from bookings;
    count
   -------
    14
   (1 row)

   cyf_hotels=#
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
2. SQL injection example. See the codes for different GET endpoint implementations for `hotels` in the `server.js` 



