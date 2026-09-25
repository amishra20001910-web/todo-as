import React, { useState } from 'react';

const TodoForm = ({ onAddTodo, isLoading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setFormError('Please enter a task title.');
      return;
    }

    setFormError('');
    try {
      await onAddTodo({
        title: title.trim(),
        description: description.trim() || null,
      });
      // Clear form on success
      setTitle('');
      setDescription('');
    } catch (err) {
      setFormError(err.message || 'Failed to create todo. Please try again.');
    }
  };

  return (
    <div className="card add-todo-card">
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
        Add New Task
      </h3>

      {formError && (
        <div className="alert alert-danger" style={{ padding: '0.6rem 0.9rem', fontSize: '0.85rem' }}>
          <span>{formError}</span>
          <button type="button" className="alert-close" onClick={() => setFormError('')}>
            &times;
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} id="todo-form">
        <div className="form-group">
          <label htmlFor="todo-title" className="form-label">
            Task Title <span style={{ color: 'var(--danger)' }}>*</span>
          </label>
          <input
            id="todo-title"
            type="text"
            className="form-control"
            placeholder="e.g. Complete quarterly financial review"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (formError) setFormError('');
            }}
            disabled={isLoading}
            autoComplete="off"
            maxLength={255}
          />
        </div>

        <div className="form-group">
          <label htmlFor="todo-description" className="form-label">
            Description <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(Optional)</span>
          </label>
          <textarea
            id="todo-description"
            className="form-control"
            placeholder="Add relevant notes, links, or sub-tasks..."
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          id="add-todo-btn"
          disabled={isLoading || !title.trim()}
          style={{ width: '100%' }}
        >
          {isLoading ? 'Adding Task...' : '+ Add Task'}
        </button>
      </form>
    </div>
  );
};

export default TodoForm;
