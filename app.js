const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const setupSwagger = require('./swagger');

dotenv.config();

const app = express();


// Підключення до БД MySQL
/*const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});*/
//мідл
app.use(cors());
app.use(express.json());

app.use('/api', require('./routes/tasks'));
app.use('/api/auth', require('./routes/auth'));

// свагер док
setupSwagger(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер працює на порту ${PORT}, логування запитів увімкнено`);
});
