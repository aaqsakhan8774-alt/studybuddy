import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import TaskBoard from './components/TaskBoard';
import NotesPanel from './components/NotesPanel';
import './App.css';

function Dashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('tasks');

  return (
    <div className="dashboard">
      <header className="topbar">
        <h1>StudyBuddy</h1>
        <div className="user-info">
          <span>Hi, {user.name}</span>
          <button className="logout-btn" onClick={logout}>
            Log Out
          </button>
        </div>
      </header>

      <nav className="tabs">
        <button className={tab === 'tasks' ? 'active' : ''} onClick={() => setTab('tasks')}>
          Tasks
        </button>
        <button className={tab === 'notes' ? 'active' : ''} onClick={() => setTab('notes')}>
          Notes
        </button>
      </nav>

      <main>{tab === 'tasks' ? <TaskBoard /> : <NotesPanel />}</main>
    </div>
  );
}

function AppShell() {
  const { token } = useAuth();
  return token ? <Dashboard /> : <AuthForm />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
