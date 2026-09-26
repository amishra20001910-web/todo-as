const TodoService = require('../services/todoService');
const { sendSuccess } = require('../utils/apiResponse');

class TodoController {
  /**
   * Get all todos for authenticated user.
   * GET /api/todos
   */
  static async getTodos(req, res, next) {
    try {
      const todos = await TodoService.getTodos(req.user.id);
      return sendSuccess(res, 'Todos retrieved successfully', { todos, count: todos.length }, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single todo by ID.
   * GET /api/todos/:id
   */
  static async getTodoById(req, res, next) {
    try {
      const { id } = req.params;
      const todo = await TodoService.getTodoById(id, req.user.id);
      return sendSuccess(res, 'Todo retrieved successfully', { todo }, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new todo for authenticated user.
   * POST /api/todos
   */
  static async createTodo(req, res, next) {
    try {
      const { title, description } = req.body;
      const todo = await TodoService.createTodo(req.user.id, { title, description });
      return sendSuccess(res, 'Todo created successfully', { todo }, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an existing todo.
   * PUT /api/todos/:id
   */
  static async updateTodo(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description, completed } = req.body;
      const todo = await TodoService.updateTodo(id, req.user.id, { title, description, completed });
      return sendSuccess(res, 'Todo updated successfully', { todo }, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete an existing todo.
   * DELETE /api/todos/:id
   */
  static async deleteTodo(req, res, next) {
    try {
      const { id } = req.params;
      await TodoService.deleteTodo(id, req.user.id);
      return sendSuccess(res, 'Todo deleted successfully', { id }, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TodoController;
