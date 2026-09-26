const TodoModel = require('../models/todoModel');

class TodoService {
  /**
   * Get all todos belonging to a user.
   * @param {string} userId - UUID
   * @returns {Promise<Array>}
   */
  static async getTodos(userId) {
    return await TodoModel.findByUserId(userId);
  }

  /**
   * Get single todo by ID ensuring it belongs to the user.
   * @param {string} id - UUID
   * @param {string} userId - UUID
   * @returns {Promise<object>}
   */
  static async getTodoById(id, userId) {
    const todo = await TodoModel.findByIdAndUserId(id, userId);
    if (!todo) {
      const err = new Error('Todo not found or you are not authorized to view it.');
      err.statusCode = 404;
      throw err;
    }
    return todo;
  }

  /**
   * Create a new todo for the user.
   * @param {string} userId - UUID
   * @param {object} param1 - { title, description }
   * @returns {Promise<object>}
   */
  static async createTodo(userId, { title, description }) {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      const err = new Error('Todo title is required.');
      err.statusCode = 400;
      throw err;
    }

    if (description !== undefined && description !== null && typeof description !== 'string') {
      const err = new Error('Todo description must be a text string.');
      err.statusCode = 400;
      throw err;
    }

    return await TodoModel.create({
      userId,
      title: title.trim(),
      description: description ? description.trim() : null,
    });
  }

  /**
   * Update an existing todo owned by user.
   * @param {string} id - UUID
   * @param {string} userId - UUID
   * @param {object} updates - { title, description, completed }
   * @returns {Promise<object>}
   */
  static async updateTodo(id, userId, updates) {
    // Check if todo exists and belongs to user
    const existing = await TodoModel.findByIdAndUserId(id, userId);
    if (!existing) {
      const err = new Error('Todo not found or you are not authorized to modify it.');
      err.statusCode = 404;
      throw err;
    }

    if (updates.title !== undefined) {
      if (typeof updates.title !== 'string' || updates.title.trim().length === 0) {
        const err = new Error('Todo title cannot be empty.');
        err.statusCode = 400;
        throw err;
      }
    }

    if (updates.description !== undefined && updates.description !== null) {
      if (typeof updates.description !== 'string') {
        const err = new Error('Todo description must be a string.');
        err.statusCode = 400;
        throw err;
      }
    }

    if (updates.completed !== undefined) {
      if (typeof updates.completed !== 'boolean') {
        const err = new Error('Completed status must be a boolean value.');
        err.statusCode = 400;
        throw err;
      }
    }

    const updated = await TodoModel.update(id, userId, updates);
    return updated;
  }

  /**
   * Delete a todo owned by user.
   * @param {string} id - UUID
   * @param {string} userId - UUID
   * @returns {Promise<boolean>}
   */
  static async deleteTodo(id, userId) {
    const existing = await TodoModel.findByIdAndUserId(id, userId);
    if (!existing) {
      const err = new Error('Todo not found or you are not authorized to delete it.');
      err.statusCode = 404;
      throw err;
    }

    return await TodoModel.delete(id, userId);
  }
}

module.exports = TodoService;
