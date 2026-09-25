import React, { useState } from 'react';

const TodoItem = ({ todo, onToggle, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemError, setItemError] = useState('');

  const handleToggle = async () => {
    try {
      await onToggle(todo);
    } catch (err) {
      console.error('Error toggling todo:', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      setItemError('Title cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setItemError('');
    try {
      await onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
      });
      setIsEditing(false);
    } catch (err) {
      setItemError(err.message || 'Failed to update task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
    setItemError('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div
      className={`todo-item ${todo.completed ? 'completed' : ''}`}
      id={`todo-item-${todo.id}`}
    >
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        id={`checkbox-${todo.id}`}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />

      <div className="todo-content">
        {isEditing ? (
          <form onSubmit={handleSave} className="edit-form">
            {itemError && (
              <div className="alert alert-danger" style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', margin: 0 }}>
                {itemError}
              </div>
            )}
            <input
              type="text"
              className="form-control"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Task title"
              required
              disabled={isSubmitting}
              autoFocus
            />
            <textarea
              className="form-control"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Task description (optional)"
              rows={2}
              disabled={isSubmitting}
            />
            <div className="edit-form-actions">
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={isSubmitting || !editTitle.trim()}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h4 className="todo-title">{todo.title}</h4>
            {todo.description && (
              <p className="todo-description">{todo.description}</p>
            )}
            <div className="todo-meta">
              <span
                className={`status-badge ${
                  todo.completed ? 'badge-completed' : 'badge-pending'
                }`}
              >
                {todo.completed ? 'Completed' : 'In Progress'}
              </span>
              <span>Created {formatDate(todo.created_at)}</span>
            </div>
          </>
        )}
      </div>

      {!isEditing && (
        <div className="todo-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsEditing(true)}
            id={`edit-todo-${todo.id}`}
            title="Edit task"
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(todo.id)}
            id={`delete-todo-${todo.id}`}
            title="Delete task"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
