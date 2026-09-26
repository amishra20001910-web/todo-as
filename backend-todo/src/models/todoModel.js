const { supabase, checkDatabaseConfig } = require('../config/supabase');

class TodoModel {
  /**
   * Fetch all todos belonging to a specific user.
   * @param {string} userId - UUID of the user
   * @returns {Promise<Array>} List of todos
   */
  static async findByUserId(userId) {
    checkDatabaseConfig();
    const { data, error } = await supabase
      .from('todos')
      .select('id, user_id, title, description, completed, created_at, updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }
    return data || [];
  }

  /**
   * Fetch a single todo by its ID and user ID.
   * @param {string} id - UUID of the todo
   * @param {string} userId - UUID of the user
   * @returns {Promise<object|null>} The todo if found and owned
   */
  static async findByIdAndUserId(id, userId) {
    checkDatabaseConfig();
    const { data, error } = await supabase
      .from('todos')
      .select('id, user_id, title, description, completed, created_at, updated_at')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }
    return data;
  }

  /**
   * Create a new todo record for the authenticated user.
   * @param {object} todoData - { userId, title, description }
   * @returns {Promise<object>} Created todo record
   */
  static async create({ userId, title, description }) {
    checkDatabaseConfig();
    const insertPayload = {
      user_id: userId,
      title: title.trim(),
      description: description ? description.trim() : null,
      completed: false,
    };

    const { data, error } = await supabase
      .from('todos')
      .insert([insertPayload])
      .select('id, user_id, title, description, completed, created_at, updated_at')
      .single();

    if (error) {
      throw error;
    }
    return data;
  }

  /**
   * Update an existing todo owned by the authenticated user.
   * @param {string} id - UUID of the todo
   * @param {string} userId - UUID of the user
   * @param {object} updates - { title, description, completed }
   * @returns {Promise<object|null>} Updated todo record
   */
  static async update(id, userId, updates) {
    checkDatabaseConfig();
    const updatePayload = {};

    if (updates.title !== undefined) {
      updatePayload.title = updates.title.trim();
    }
    if (updates.description !== undefined) {
      updatePayload.description = updates.description !== null && updates.description !== undefined
        ? updates.description.trim()
        : null;
    }
    if (updates.completed !== undefined) {
      updatePayload.completed = Boolean(updates.completed);
    }

    const { data, error } = await supabase
      .from('todos')
      .update(updatePayload)
      .eq('id', id)
      .eq('user_id', userId)
      .select('id, user_id, title, description, completed, created_at, updated_at')
      .maybeSingle();

    if (error) {
      throw error;
    }
    return data;
  }

  /**
   * Delete a todo owned by the authenticated user.
   * @param {string} id - UUID of the todo
   * @param {string} userId - UUID of the user
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  static async delete(id, userId) {
    checkDatabaseConfig();
    const { data, error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select('id')
      .maybeSingle();

    if (error) {
      throw error;
    }
    return Boolean(data);
  }
}

module.exports = TodoModel;
