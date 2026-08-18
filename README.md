# StudyBuddy

A full-stack task and notes manager built for students. Register an
account, track assignments/tasks through To Do → In Progress → Done, and
keep quick study notes — all backed by a real database with secure,
token-based authentication.

## Features

- User registration and login with hashed passwords (bcrypt) and JWT sessions
- Create, update, and delete tasks with a three-stage status workflow
- Create, update, and delete free-form notes
- Per-user data isolation — every task/note is scoped to the logged-in user
- Responsive dark-themed dashboard UI

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose)
**Auth:** JSON Web Tokens, bcrypt password hashing
**Frontend:** React, Vite

## Project Structure

```
studybuddy/
├── backend/
│   └── src/
│       ├── server.js       # Express app entry point
│       ├── db.js           # MongoDB connection
│       ├── config.js       # Environment-driven config
│       ├── models/         # User, Task, Note (Mongoose schemas)
│       ├── middleware/
│       │   └── auth.js     # JWT verification middleware
│       └── routes/
│           ├── auth.js     # Register / login
│           ├── tasks.js    # Task CRUD (protected)
│           └── notes.js    # Note CRUD (protected)
└── frontend/
    └── src/
        ├── api.js                    # Fetch wrapper for the backend API
        ├── context/AuthContext.jsx   # Auth state + localStorage persistence
        └── components/
            ├── AuthForm.jsx
            ├── TaskBoard.jsx
            └── NotesPanel.jsx
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm start
```

Runs on `http://localhost:4001`. MongoDB is provisioned automatically via
`mongodb-memory-server`, which downloads and runs a real local MongoDB
instance with data persisted to `backend/data/mongo` — no separate database
install or Docker container required.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` and talks to the backend API.

## API

| Method | Endpoint | Auth | Description |
|--------|----------|------|--------------|
| POST | `/api/auth/register` | No | Create an account, returns a JWT |
| POST | `/api/auth/login` | No | Log in, returns a JWT |
| GET | `/api/tasks` | Yes | List the current user's tasks |
| POST | `/api/tasks` | Yes | Create a task |
| PUT | `/api/tasks/:id` | Yes | Update a task |
| DELETE | `/api/tasks/:id` | Yes | Delete a task |
| GET | `/api/notes` | Yes | List the current user's notes |
| POST | `/api/notes` | Yes | Create a note |
| PUT | `/api/notes/:id` | Yes | Update a note |
| DELETE | `/api/notes/:id` | Yes | Delete a note |

Protected routes require an `Authorization: Bearer <token>` header.

## Security Notes

- Passwords are never stored in plaintext — only bcrypt hashes are persisted.
- JWTs are signed server-side and expire after 7 days.
- Every task/note query is scoped by the authenticated user's ID, so users
  can only ever read or modify their own data.

## License

MIT
