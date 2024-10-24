import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    const savedTasks = localStorage.getItem('mydayapp-reactjs');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mydayapp-reactjs', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    const trimmedTask = newTask.trim();
    if (trimmedTask) {
      setTasks([...tasks, { id: uuidv4(), title: trimmedTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditingText(task.title);
  };

  const saveEdit = (id) => {
    const trimmedText = editingText.trim();
    if (trimmedText) {
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, title: trimmedText } : task
      ));
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const pendingCount = tasks.filter(task => !task.completed).length;

  const TaskList = () => {
    const location = useLocation();
    const filter = location.pathname.slice(1) || 'all';

    const filteredTasks = tasks.filter(task => {
      if (filter === 'pending') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    });

    return (
      <ul className="todo-list">
        {filteredTasks.map(task => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            {editingId === task.id ? (
              <input
                type="text"
                className="edit"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onBlur={() => saveEdit(task.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit(task.id);
                  if (e.key === 'Escape') cancelEdit();
                }}
                autoFocus
              />
            ) : (
              <div className="view">
                <input
                  type="checkbox"
                  className="toggle"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <label onDoubleClick={() => startEditing(task)}>
                  {task.title}
                </label>
                <button className="destroy" onClick={() => deleteTask(task.id)} />
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Router>
      <div className="todoapp">
        <header className="header">
          <h1>My Day</h1>
          <h2>All my tasks in one place</h2>
          <form onSubmit={addTask}>
            <input
              className="new-todo"
              placeholder="Type new todo"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              autoFocus
            />
          </form>
        </header>

        {tasks.length > 0 && (
          <main id="main">
            <TaskList />
          </main>
        )}

        {tasks.length > 0 && (
          <footer id="footer">
            <span className="todo-count">
              <strong>{pendingCount}</strong> {pendingCount === 1 ? 'item' : 'items'} left
            </span>

            <ul className="filters">
              <li><Link to="/all">All</Link></li>
              <li><Link to="/pending">Pending</Link></li>
              <li><Link to="/completed">Completed</Link></li>
            </ul>

            {tasks.some(task => task.completed) && (
              <button className="clear-completed" onClick={clearCompleted}>
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>
    </Router>
  );
}

export default App;