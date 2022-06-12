const express = require("express");
const app = express();
const { Pool } = require("pg");
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cyf_hotels",
  password: "postgrespwa",
  port: 5433,
});

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

// app.get("/hotels", function (req, res) {
//   const hotelNameQuery = req.query.name;
//   console.log(`req.query.name ${hotelNameQuery}`);
//   // Inject below SQL to delete the bookings table
//   // ';delete from bookings;select * from hotels where name like '
//   let query = "SELECT * FROM hotels " + " WHERE name like " + `'%${hotelNameQuery}%'`+ " ORDER BY name";
//   console.log(`query ${query}`);
  
//   pool
//     .query(query)
//     .then((result) => res.json(result.rows))
//     .catch((error) => {
//       console.error(error);
//       res.status(500).json(error);
//     });
// });

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

app.listen(3000, function () {
  console.log("Server is listening on port 3000. Ready to accept requests!");
});

