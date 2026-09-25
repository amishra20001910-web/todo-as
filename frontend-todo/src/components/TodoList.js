import React, { useState, useMemo } from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, onToggle, onUpdate, onDelete }) => {
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate statistics
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, percentage };
  }, [todos]);

  // Filtered and searched todos
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // Status filter
      if (filter === 'pending' && todo.completed) return false;
      if (filter === 'completed' && !todo.completed) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = todo.title.toLowerCase().includes(query);
        const descMatch = todo.description
          ? todo.description.toLowerCase().includes(query)
          : false;
        return titleMatch || descMatch;
      }

      return true;
    });
  }, [todos, filter, searchQuery]);

  return (
    <div>
      {/* Productivity Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--warning)' }}>
            {stats.pending}
          </span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--success)' }}>
            {stats.completed}
          </span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--primary)' }}>
            {stats.percentage}%
          </span>
          <span className="stat-label">Completion Rate</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="filter-tabs" role="tablist">
          <button
            type="button"
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            id="filter-all-btn"
          >
            All ({stats.total})
          </button>
          <button
            type="button"
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
            id="filter-pending-btn"
          >
            Pending ({stats.pending})
          </button>
          <button
            type="button"
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
            id="filter-completed-btn"
          >
            Completed ({stats.completed})
          </button>
        </div>

        <div className="search-input-wrapper">
          <input
            type="text"
            className="form-control"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="search-todos-input"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.875rem' }}
          />
        </div>
      </div>

      {/* Todo List Render */}
      {filteredTodos.length > 0 ? (
        <div className="todo-list" id="todo-items-container">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h4 className="empty-state-title">
            {searchQuery
              ? 'No matching tasks found'
              : filter === 'completed'
              ? 'No completed tasks yet'
              : filter === 'pending'
              ? 'All caught up! No pending tasks'
              : 'No tasks created yet'}
          </h4>
          <p className="empty-state-text">
            {searchQuery
              ? 'Try modifying your search term or clear the filter to see more tasks.'
              : filter !== 'all'
              ? 'Switch back to the "All" tab to view your complete task backlog.'
              : 'Get started by creating your first task using the form above.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TodoList;
