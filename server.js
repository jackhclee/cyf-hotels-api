const express = require("express");
const app = express();
const { Pool } = require("pg");
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const customersEndpoint = "/customers";
const defaultAddress  = null;
const defaultCity     = null;
const defaultPostcode = null;
const defaultCountry  = null;
// *********************************

// Create
app.post(customersEndpoint, async (req, res) => {

  let newCustomer = {
    name     : req.body.name,
    email    : req.body.email,
    address  : req.body.address  || defaultAddress,
    city     : req.body.city     || defaultCity,
    postcode : req.body.postcode || defaultPostcode,
    country  : req.body.country  || defaultCountry,
  }

  console.log(newCustomer)
  
  try {
    console.log("trying to insert customer")
    let result = await pool.query(
      " INSERT INTO customers (name, email, address, city, postcode, country) " +
      " VALUES                ($1,   $2,    $3,      $4,   $5,       $6) " +
      " RETURNING id ",
      [newCustomer.name, newCustomer.email, newCustomer.address, newCustomer.city, newCustomer.postcode, newCustomer.country]
    );
    res.status(200).send({id: result.rows[0].id});
  } catch (error) {
    console.log(error);
    res.status(400).send({err: "Bad input"});
  }
})

// Retrieve
app.get(customersEndpoint, async (req, res) => {

  try {
    console.log("trying to get customer")
    let result = await pool.query(
      " SELECT id, name, email, address, city, postcode, country FROM customers ORDER BY id"
    );
    console.log(`${result.rows.length} rows returned`)
    res.status(200).send({recs: result.rows});
  } catch (error) {
    console.log(error);
    res.status(400).send({err: "Bad input"});
  }
})

// Update
app.put(customersEndpoint + "/:id", async (req, res) => {

  console.log(req.body)

  let newCustomer = {
    name     : req.body.name,
    email    : req.body.email,
    address  : req.body.address,
    city     : req.body.city,
    postcode : req.body.postcode,
    country  : req.body.country
  }

  console.log(newCustomer)
  
  let updateSQL = " UPDATE customers SET " + 
                  " name     = COALESCE($1, name),"     + 
                  " email    = COALESCE($2, email),"    + 
                  " address  = COALESCE($3, address),"  + 
                  " city     = COALESCE($4, city),"     + 
                  " postcode = COALESCE($5, postcode)," + 
                  " country  = COALESCE($6, country) "  + 
                  " WHERE id = $7 " +
                  " RETURNING id";
  
  console.log(updateSQL);

  try {
    console.log("trying to update customer " + req.params.id)
    let result = await pool.query(
      updateSQL,
      [newCustomer.name, newCustomer.email, newCustomer.address, newCustomer.city, newCustomer.postcode, newCustomer.country, req.params.id]
    );
    res.status(200).send({id: result.rows[0].id});
  } catch (error) {
    console.log(error);
    res.status(400).send({err: "Bad input"});
  }
})

// Delete
app.delete(customersEndpoint + "/:id", async (req, res) => {
  console.log(req.body)

  let newCustomer = {
    name     : req.body.name,
    email    : req.body.email,
    address  : req.body.address,
    city     : req.body.city,
    postcode : req.body.postcode,
    country  : req.body.country
  }

  console.log(newCustomer)
  
  let deleteSQL = " DELETE FROM customers " + 
                  " WHERE id = $1 " +
                  " RETURNING id";
  
  console.log(deleteSQL);

  try {
    console.log("trying to delete customer " + req.params.id)
    let result = await pool.query(
      deleteSQL,
      [req.params.id]
    );
    res.status(200).send({id: result.rows[0].id});
  } catch (error) {
    console.log(error);
    res.status(400).send({err: "Bad input"});
  }
})

// *********************************

// Original example without user provided input

// app.get("/hotels", function (req, res) {
//   pool
//     .query("SELECT * FROM hotels ORDER BY name")
//     .then((result) => res.json(result.rows))
//     .catch((error) => {
//       console.error(error);
//       res.status(500).json(error);
//     });
// });

// Parameter binding example

// app.get("/hotels", function (req, res) {
//   const hotelNameQuery = req.query.name;
//   console.log(`req.query.name ${hotelNameQuery}`);
//   let params = [];
//   if (hotelNameQuery) {
//       query = `SELECT * FROM hotels WHERE name LIKE $1 ORDER BY name`;
//       console.log(`query ${query}`);
//       params.push(`%${hotelNameQuery}%`);
//   }
  
//   pool
//     .query(query, params)
//     .then((result) => res.json(result.rows))
//     .catch((error) => {
//       console.error(error);
//       res.status(500).json(error);
//     });
// });

// Proposed SQL injection example

app.get("/hotels", function (req, res) {
  const hotelNameQuery = req.query.name;
  console.log(`req.query.name ${hotelNameQuery}`);
  // Inject below SQL to delete the bookings table
  // ';delete from bookings;select * from hotels where name like '
  let query = "SELECT * FROM hotels " + " WHERE name like " + `'%${hotelNameQuery}%'`+ " ORDER BY name";
  console.log(`query ${query}`);
  
  pool
    .query(query)
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

app.post("/hotels", function (req, res) {
  const newHotelName = req.body.name;
  const newHotelRooms = req.body.rooms;
  const newHotelPostcode = req.body.postcode;

  if (!Number.isInteger(newHotelRooms) || newHotelRooms <= 0) {
    return res
      .status(400)
      .send("The number of rooms should be a positive integer.");
  }

  pool
    .query("SELECT * FROM hotels WHERE name=$1", [newHotelName])
    .then((result) => {
      if (result.rows.length > 0) {
        return res
          .status(400)
          .send("An hotel with the same name already exists!");
      } else {
        const query =
          "INSERT INTO hotels (name, rooms, postcode) VALUES ($1, $2, $3)";
        pool
          .query(query, [newHotelName, newHotelRooms, newHotelPostcode])
          .then(() => res.send("Hotel created!"))
          .catch((error) => {
            console.error(error);
            res.status(500).json(error);
          });
      }
    });
});

let port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Server is listening on port ${port}. Ready to accept requests!`);
});

