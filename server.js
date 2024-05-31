const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const authRoutes = require('./routes/authRoutes');

require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);

mongoose.connect("mongodb://localhost:27017/OMS");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch {
    res.sendStatus(401);
  }
}

app.get("/protected", authMiddleware, (req, res) => {
  res.send("This is a protected route");
});

app.listen(3000, () => console.log("Server started on port 3000"));
