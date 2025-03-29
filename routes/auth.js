const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = process.env;

// Реєстрація
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Реєстрація нового користувача
 *     description: Створює нового користувача з email та паролем
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "mypassword123"
 *     responses:
 *       201:
 *         description: Користувача зареєстровано
 *       500:
 *         description: Помилка реєстрації
 */
router.post('/register', (req, res) => {
  const { email, password } = req.body;

  User.createUser(email, password, (err, result) => {
    if (err) return res.status(500).send(`Error during registration/ ${err.message}`);
    res.status(201).send('The user is registered');
  });
});

// Логін
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Логін користувача
 *     description: Авторизація користувача за email та паролем
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "mypassword123"
 *     responses:
 *       200:
 *         description: Успішний вхід, повертає JWT-токен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *       400:
 *         description: Невірний email або пароль
 */
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
