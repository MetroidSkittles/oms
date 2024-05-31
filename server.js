const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');

require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);

mongoose.connect("mongodb://localhost:27017/OMS");

app.get("/protected", authMiddleware, (req, res) => {
  res.send("This is a protected route");
});

app.listen(3000, () => console.log("Server started on port 3000"));
