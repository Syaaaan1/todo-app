const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

module.exports = { swaggerDocs };
