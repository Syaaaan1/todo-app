const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.status(403).send('Token not provided');

  // прибрати bearer зі строки токену
  const tokenString = token.split(' ')[1];

  jwt.verify(tokenString, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = decoded;
    next();
  });
};

module.exports = { authenticateJWT };
