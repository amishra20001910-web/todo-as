const express = require('express');
const TodoController = require('../controllers/todoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All todo routes require authentication
router.use(authMiddleware);

// CRUD routes for todos
router.get('/', TodoController.getTodos);
router.post('/', TodoController.createTodo);
router.get('/:id', TodoController.getTodoById);
router.put('/:id', TodoController.updateTodo);
router.delete('/:id', TodoController.deleteTodo);

module.exports = router;
