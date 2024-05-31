const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({ email: req.body.email, password: hashedPassword });

    await user.save();
    return res.sendStatus(201);

  } catch (err) {
    return res.sendStatus(400);
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.sendStatus(401);
  }

  const expiresIn = 30 * 60; // 30 minutes in seconds
  
  const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
    expiresIn,
  });

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_SECRET
  );

  user.refresh_token = refreshToken;

  await user.save();

  return res.send({
    access_token: token,
    token_type: "Bearer",
    expires_in: expiresIn,
    refresh_token: refreshToken,
  });
});

router.post("/refresh", async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.sendStatus(401);
  }

  const user = await User.findOne({ refresh_token });
  if (!user) {
    return res.sendStatus(403);
  }

  jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const expiresIn = 30 * 60; // 30 minutes in seconds
    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
      expiresIn,
    });

    return res.send({
      access_token: token,
      token_type: "Bearer",
      expires_in: expiresIn,
    });
  });
});

module.exports = router;
