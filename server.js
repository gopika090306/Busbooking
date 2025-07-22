const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// DB connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ganesh@09', // Change if needed
  database: 'bus_booking'
});

db.connect((err) => {
  if (err) {
    console.error('❌ DB Connection Failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL');
});

// Booking route
app.post('/book', (req, res) => {
  console.log("Incoming booking data:", req.body);

  const { name, age, origin, destination, journey_date } = req.body;

  if (!name || !age || !origin || !destination || !journey_date) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  const ticket_number = 'T' + Math.floor(100000 + Math.random() * 900000);

  const sql = `
    INSERT INTO bookings (name, age, origin, destination, journey_date, ticket_number)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, age, origin, destination, journey_date, ticket_number], (err, result) => {
    if (err) {
      console.error('❌ DB INSERT ERROR:', err);
      return res.status(500).json({ success: false });
    }

    res.json({
      success: true,
      name,
      age,
      origin,
      destination,
      journey_date,
      ticket_number
    });
  });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
