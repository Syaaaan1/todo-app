const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.File({ filename: './requests.log' })
  ]
});

module.exports = logger;
