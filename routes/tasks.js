const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { authenticateJWT } = require('../utils/auth');

// Створити завдання
router.post('/', authenticateJWT, (req, res) => {
  const { title, description, status } = req.body;
  const userId = req.user.id;

  Task.createTask(title, description, status, userId, (err, result) => {
    if (err) return res.status(500).send(`Error creating task/ ${err.message}`);
    res.status(201).send('Task created');
  });
});

// Отримати завдання користувача
router.get('/', authenticateJWT, (req, res) => {
  const userId = req.user.id;

  Task.getTasksByUserId(userId, (err, tasks) => {
    if (err) return res.status(500).send('Error receiving tasks');
    res.json(tasks);
  });
});

// Оновити статус завдання
router.put('/:id', authenticateJWT, (req, res) => {
  const { status } = req.body;
  const taskId = req.params.id;

  Task.updateTaskStatus(taskId, status, (err, result) => {
    if (err) return res.status(500).send('Error updating task status');
    res.send('Task status updated');
  });
});

// Видалити завдання
router.delete('/:id', authenticateJWT, (req, res) => {
  const taskId = req.params.id;

  Task.deleteTask(taskId, (err, result) => {
    if (err) return res.status(500).send('Error deleting task');
    res.send('Task deleted');
  });
});

module.exports = router;
