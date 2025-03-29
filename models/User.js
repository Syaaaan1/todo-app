const bcrypt = require('bcryptjs');
const db = require('../config/db');

const User = {
  createUser: (email, password, callback) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return callback(err);

      const query = 'INSERT INTO users (email, password_hash) VALUES (?, ?)';
      db.query(query, [email, hashedPassword], callback);
    });
  },

  findUserByEmail: (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], callback);
  }
};

module.exports = User;
