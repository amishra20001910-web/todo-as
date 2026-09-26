const { supabase, checkDatabaseConfig } = require('../config/supabase');

class UserModel {
  /**
   * Find a user by email address.
   * @param {string} email
   * @returns {Promise<object|null>}
   */
  static async findByEmail(email) {
    checkDatabaseConfig();
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, password, created_at, updated_at')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle();

    if (error) {
      throw error;
    }
    return data;
  }

  /**
   * Find a user by primary key ID.
   * @param {string} id - UUID
   * @returns {Promise<object|null>} Safe user object without password
   */
  static async findById(id) {
    checkDatabaseConfig();
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, created_at, updated_at')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }
    return data;
  }

  /**
   * Create a new user record.
   * @param {object} userData - { name, email, password }
   * @returns {Promise<object>} Safe user object without password
   */
  static async create({ name, email, password }) {
    checkDatabaseConfig();
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        },
      ])
      .select('id, name, email, created_at, updated_at')
      .single();

    if (error) {
      throw error;
    }
    return data;
  }
}

module.exports = UserModel;
