const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = process.env;

// Реєстрація
router.post('/register', (req, res) => {
  const { email, password } = req.body;

  User.createUser(email, password, (err, result) => {
    if (err) return res.status(500).send(`Error during registration/ ${err.message}`);
    res.status(201).send('The user is registered');
  });
});

// Логін
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findUserByEmail(email, (err, users) => {
    if (err || users.length === 0) return res.status(400).send('User not found');

    const user = users[0];
    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (!isMatch) return res.status(400).send('Invalid password');
      const payload = { id: user.id };
      const token = jwt.encode(payload, JWT_SECRET);
      res.json({ token });
    });    
  });
});

module.exports = router;
