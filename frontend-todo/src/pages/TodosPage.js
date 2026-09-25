import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { todoService } from '../services/todoService';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const TodosPage = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch user's todos from REST API
  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await todoService.getTodos();
      setTodos(data);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load your tasks. Please refresh.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Create a new todo
  const handleAddTodo = async (newTodoData) => {
    setIsAdding(true);
    setErrorMessage('');
    try {
      const created = await todoService.createTodo(newTodoData);
      setTodos((prev) => [created, ...prev]);
      setSuccessMessage('Task created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      return created;
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create task.');
      throw err;
    } finally {
      setIsAdding(false);
    }
  };

  // Toggle todo completion
  const handleToggleTodo = async (todo) => {
    setErrorMessage('');
    // Optimistic UI update
    const previousTodos = [...todos];
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t))
    );

    try {
      const updated = await todoService.toggleTodo(todo.id, todo.completed);
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    } catch (err) {
      // Revert optimistic update
      setTodos(previousTodos);
      setErrorMessage(err.message || 'Failed to update task status.');
    }
  };

  // Update todo title and description
  const handleUpdateTodo = async (id, updates) => {
    setErrorMessage('');
    try {
      const updated = await todoService.updateTodo(id, updates);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setSuccessMessage('Task updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      return updated;
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update task.');
      throw err;
    }
  };

  // Delete a todo
  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setErrorMessage('');
    // Optimistic UI update
    const previousTodos = [...todos];
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      await todoService.deleteTodo(id);
      setSuccessMessage('Task deleted successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      // Revert optimistic update
      setTodos(previousTodos);
      setErrorMessage(err.message || 'Failed to delete task.');
    }
  };

  return (
    <div className="main-content">
      {/* Dashboard Greeting Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Welcome back, {user?.name ? user.name.split(' ')[0] : 'there'}!
        </h1>
        <p className="dashboard-subtitle">
          Here is your productivity dashboard. Manage, organize, and complete your daily goals.
        </p>
      </div>

      {/* Global Alerts */}
      <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />
      {successMessage && (
        <div className="alert alert-success" role="alert">
          <span>{successMessage}</span>
          <button
            type="button"
            className="alert-close"
            onClick={() => setSuccessMessage('')}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      )}

      {/* Add Task Form Card */}
      <div className="add-todo-section">
        <TodoForm onAddTodo={handleAddTodo} isLoading={isAdding} />
      </div>

      {/* Todo List and Stats */}
      {isLoading ? (
        <Loading message="Fetching your tasks..." />
      ) : (
        <TodoList
          todos={todos}
          onToggle={handleToggleTodo}
          onUpdate={handleUpdateTodo}
          onDelete={handleDeleteTodo}
        />
      )}
    </div>
  );
};

export default TodosPage;
