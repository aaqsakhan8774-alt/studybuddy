import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function NotesPanel() {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadNotes() {
    const data = await api.getNotes(token);
    setNotes(data);
    setLoading(false);
  }

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await api.createNote(token, { title: title.trim(), content });
    setTitle('');
    setContent('');
    loadNotes();
  }

  async function handleDelete(id) {
    await api.deleteNote(token, id);
    loadNotes();
  }

  if (loading) return <p className="loading">Loading notes...</p>;

  return (
    <div className="panel">
      <form className="note-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <button type="submit">Add Note</button>
      </form>

      {notes.length === 0 ? (
        <p className="empty">No notes yet. Add one above.</p>
      ) : (
        <ul className="note-list">
          {notes.map((note) => (
            <li key={note._id} className="note-item">
              <div className="note-header">
                <strong>{note.title}</strong>
                <button className="delete-btn" onClick={() => handleDelete(note._id)}>
                  Delete
                </button>
              </div>
              {note.content && <p className="note-content">{note.content}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
