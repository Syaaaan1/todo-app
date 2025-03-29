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
  },

  getTasksByStatus: (status, callback) => {
    const query = 'SELECT * FROM tasks WHERE status = ?';
    db.query(query, [status], callback);
  },
  
  getTasksByStatusAndUser: (status, userId, callback) => {
    const query = 'SELECT * FROM tasks WHERE status = ? AND user_id = ?';
    db.query(query, [status, userId], callback);
  }
};

module.exports = Task;
