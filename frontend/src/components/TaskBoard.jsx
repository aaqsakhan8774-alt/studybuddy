import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

const STATUSES = ['todo', 'in-progress', 'done'];
const STATUS_LABELS = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };

export default function TaskBoard() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    const data = await api.getTasks(token);
    setTasks(data);
    setLoading(false);
  }

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await api.createTask(token, { title: title.trim() });
    setTitle('');
    loadTasks();
  }

  async function cycleStatus(task) {
    const next = STATUSES[(STATUSES.indexOf(task.status) + 1) % STATUSES.length];
    await api.updateTask(token, task._id, { status: next });
    loadTasks();
  }

  async function handleDelete(id) {
    await api.deleteTask(token, id);
    loadTasks();
  }

  if (loading) return <p className="loading">Loading tasks...</p>;

  return (
    <div className="panel">
      <form className="inline-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="New task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      {tasks.length === 0 ? (
        <p className="empty">No tasks yet. Add one above.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              <button className={`status-pill status-${task.status}`} onClick={() => cycleStatus(task)}>
                {STATUS_LABELS[task.status]}
              </button>
              <span className="task-title">{task.title}</span>
              <button className="delete-btn" onClick={() => handleDelete(task._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
