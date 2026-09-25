import { apiRequest } from './api';

export const todoService = {
  /**
   * Fetch all todos belonging to authenticated user.
   */
  async getTodos() {
    const res = await apiRequest('/todos', {
      method: 'GET',
    });
    return res.data && res.data.todos ? res.data.todos : [];
  },

  /**
   * Fetch a single todo by ID.
   * @param {string} id - UUID
   */
  async getTodoById(id) {
    const res = await apiRequest(`/todos/${id}`, {
      method: 'GET',
    });
    return res.data && res.data.todo ? res.data.todo : null;
  },

  /**
   * Create a new todo.
   * @param {object} param0 - { title, description }
   */
  async createTodo({ title, description }) {
    const res = await apiRequest('/todos', {
      method: 'POST',
      body: { title, description },
    });
    return res.data && res.data.todo ? res.data.todo : null;
  },

  /**
   * Update an existing todo.
   * @param {string} id - UUID
   * @param {object} updates - { title, description, completed }
   */
  async updateTodo(id, updates) {
    const res = await apiRequest(`/todos/${id}`, {
      method: 'PUT',
      body: updates,
    });
    return res.data && res.data.todo ? res.data.todo : null;
  },

  /**
   * Toggle completion state of a todo.
   * @param {string} id
   * @param {boolean} currentStatus
   */
  async toggleTodo(id, currentStatus) {
    return await this.updateTodo(id, { completed: !currentStatus });
  },

  /**
   * Delete a todo.
   * @param {string} id - UUID
   */
  async deleteTodo(id) {
    const res = await apiRequest(`/todos/${id}`, {
      method: 'DELETE',
    });
    return res.success;
  },
};
