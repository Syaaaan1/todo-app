const db = require('../config/db');

const Task = {
  createTask: (title, description, status, userId, callback) => {
    const query = 'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)';
    db.query(query, [title, description, status, userId], callback);
  },

  getTasksByUserId: (userId, callback) => {
    const query = 'SELECT * FROM tasks WHERE user_id = ?';
    db.query(query, [userId], callback);
  },

  updateTaskStatus: (taskId, status, callback) => {
    const query = 'UPDATE tasks SET status = ? WHERE id = ?';
    db.query(query, [status, taskId], callback);
  },

  deleteTask: (taskId, callback) => {
    const query = 'DELETE FROM tasks WHERE id = ?';
    db.query(query, [taskId], callback);
  }
};

module.exports = Task;
