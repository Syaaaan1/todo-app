const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { authenticateJWT } = require('../utils/auth');

// Створити завдання
/**
 * @swagger
 * /api/:
 *   post:
 *     summary: Створення нового завдання
 *     description: Додає нове завдання для авторизованого користувача
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Прочитати книгу"
 *               description:
 *                 type: string
 *                 example: "Прочитати 50 сторінок книги по Node.js"
 *               status:
 *                 type: string
 *                 enum: [new, in_progress, completed]
 *                 example: "new"
 *     responses:
 *       201:
 *         description: Завдання успішно створено
 *       400:
 *         description: Некоректний запит
 *       500:
 *         description: Помилка сервера
 */
router.post('/', authenticateJWT, (req, res) => {
  const { title, description, status } = req.body;
  const userId = req.user.id;

  Task.createTask(title, description, status, userId, (err, result) => {
    if (err) return res.status(500).send(`Error creating task/ ${err.message}`);
    res.status(201).send('Task created');
  });
});

// Отримати завдання користувача
/**
 * @swagger
 * /api/:
 *   get:
 *     summary: Отримати всі завдання користувача
 *     description: Повертає всі завдання для авторизованого користувача
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список завдань користувача
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Прочитати книгу"
 *                   description:
 *                     type: string
 *                     example: "Прочитати 50 сторінок книги по Node.js"
 *                   status:
 *                     type: string
 *                     enum: [new, in_progress, completed]
 *                     example: "new"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-29T12:34:56Z"
 *       401:
 *         description: Необхідна авторизація
 *       500:
 *         description: Помилка сервера
 */
router.get('/', authenticateJWT, (req, res) => {
  const userId = req.user.id;

  Task.getTasksByUserId(userId, (err, tasks) => {
    if (err) return res.status(500).send('Error receiving tasks');
    res.json(tasks);
  });
});

// Оновити статус завдання
/**
 * @swagger
 * /api/{id}:
 *   put:
 *     summary: Оновити статус завдання
 *     description: Оновлює статус завдання за вказаним ID для авторизованого користувача.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID завдання для оновлення статусу
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [new, in_progress, done]
 *                 example: "in_progress"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Статус завдання успішно оновлений
 *       400:
 *         description: Невірний ID або статус
 *       401:
 *         description: Необхідна авторизація
 *       500:
 *         description: Помилка сервера
 */

router.put('/:id', authenticateJWT, (req, res) => {
  const { status } = req.body;
  const taskId = req.params.id;

  Task.updateTaskStatus(taskId, status, (err, result) => {
    if (err) return res.status(500).send('Error updating task status');
    res.send('Task status updated');
  });
});

// Видалити завдання
/**
 * @swagger
 * /api/{id}:
 *   delete:
 *     summary: "Видалити завдання"
 *     description: "Цей метод дозволяє видаляти задачу за вказаним ID."
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID задачі, яку потрібно видалити"
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "Завдання успішно видалено"
 *       400:
 *         description: "Невірний ID"
 *       401:
 *         description: "Необхідна авторизація"
 *       500:
 *         description: "Помилка під час видалення завдання"
 */
router.delete('/:id', authenticateJWT, (req, res) => {
  const taskId = req.params.id;

  Task.deleteTask(taskId, (err, result) => {
    if (err) return res.status(500).send('Error deleting task');
    res.send('Task deleted');
  });
});

// Отримати завдання за статусом
/**
 * @swagger
 * /api/status/{status}:
 *   get:
 *     summary: "Отримати завдання за статусом"
 *     description: "Цей метод дозволяє отримувати завдання за вказаним статусом. Для адміністратора будуть повернуті всі завдання з вказаним статусом, для інших користувачів — лише їхні завдання."
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         description: "Статус завдання для фільтрації"
 *         schema:
 *           type: string
 *           enum: [new, in-progress, done]  # Можливі статуси завдань
 *     security:
 *       - bearerAuth: []  # Це означає, що для доступу до цього маршруту потрібна авторизація за допомогою токену
 *     responses:
 *       200:
 *         description: "Завдання успішно отримано"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   status:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: "Невірний статус"
 *       401:
 *         description: "Необхідна авторизація"
 *       500:
 *         description: "Помилка при отриманні завдань"
 */
router.get('/status/:status', authenticateJWT, (req, res) => {
  const { status } = req.params;

  Task.getTasksByStatus(status, (err, tasks) => {
    if (err) return res.status(500).send('Error fetching tasks');
    res.json(tasks);
  });
});


module.exports = router;
