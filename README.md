# Auth Project — Node.js + Supabase + React

A production-ready user authentication system with **register**, **login**, **JWT sessions**, and **protected routes**.

---

## Stack

| Layer    | Tech                                    |
|----------|-----------------------------------------|
| Frontend | React 18 + React Router 6 + Vite        |
| Backend  | Node.js (ESM) + Express                 |
| Database | Supabase (PostgreSQL)                   |
| Auth     | bcryptjs password hashing + JWT tokens  |

---

## Project Structure

```
auth-project/
├── backend/
│   ├── lib/supabase.js          # Supabase client
│   ├── middleware/requireAuth.js # JWT guard
│   ├── routes/
│   │   ├── auth.js              # POST /api/auth/register|login
│   │   └── user.js              # GET|PUT /api/user/me (protected)
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   └── src/
│       ├── context/AuthContext.jsx  # Global auth state
│       ├── components/ProtectedRoute.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── Dashboard.jsx        # Protected page
│       ├── api.js                   # Fetch wrapper
│       └── App.jsx                  # Routes
└── schema.sql                       # Run this in Supabase
```

---

## Setup

### 1. Supabase

1. Go to [supabase.com](https://supabase.com) → New project
2. Once created, open **SQL Editor** and paste + run `schema.sql`
3. Go to **Project Settings → API** and copy:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` key (not anon!) → `SUPABASE_SERVICE_KEY`

> **Why service-role?** We handle auth server-side and bypass Row Level Security intentionally. Never expose this key in the frontend.

---

### 2. Backend

```bash
cd backend
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_SERVICE_KEY, and a strong JWT_SECRET
npm install
npm run dev
# → Server on http://localhost:3001
```

#### Environment variables (`.env`)

```env
PORT=3001
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
JWT_SECRET=change-me-to-something-long-and-random
```

---

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
# → App on http://localhost:5173
```

Vite proxies `/api/*` to `localhost:3001` — no CORS issues in dev.

---

## API Reference

### Auth (public)

| Method | Path                   | Body                        | Returns         |
|--------|------------------------|-----------------------------|-----------------|
| POST   | `/api/auth/register`   | `{name, email, password}`   | `{token, user}` |
| POST   | `/api/auth/login`      | `{email, password}`         | `{token, user}` |

### User (protected — send `Authorization: Bearer <token>`)

| Method | Path           | Body     | Returns         |
|--------|----------------|----------|-----------------|
| GET    | `/api/user/me` | —        | `{user}`        |
| PUT    | `/api/user/me` | `{name}` | `{user}`        |

---

## How It Works

```
Register/Login
──────────────
Client → POST /api/auth/login
Server → verify password with bcrypt
Server → sign JWT (7d expiry) with user id + email
Server → return { token, user }
Client → store token in localStorage
Client → attach token to every request as Authorization header

Protected Route
───────────────
Client navigates to /dashboard
ProtectedRoute checks AuthContext (which loaded user from /api/user/me on mount)
If no token → redirect to /login
If valid token → render Dashboard

Backend middleware (requireAuth.js)
──────────────────────────────────
Reads Authorization header
Verifies JWT signature + expiry
Attaches req.user = { id, email } for the route handler
```

---

## Production Checklist

- [ ] Use `HTTPS` — never transmit tokens over HTTP
- [ ] Store `JWT_SECRET` in your hosting provider's secrets (not .env committed to git)
- [ ] Add `.env` to `.gitignore`
- [ ] Consider `httpOnly` cookies instead of localStorage for higher XSS protection
- [ ] Add rate limiting (`express-rate-limit`) to `/api/auth/*`
- [ ] Add email verification via Supabase Auth or a transactional email provider
- [ ] Set token expiry shorter (e.g. `15m`) with refresh tokens for sensitive apps

---

## Deploy

**Backend** → [Railway](https://railway.app) or [Render](https://render.com) (free tier)
- Set all env vars in the dashboard
- Start command: `node server.js`

**Frontend** → [Vercel](https://vercel.com) or [Netlify](https://netlify.com) (free)
- Build command: `npm run build`, output dir: `dist`
- Set `VITE_API_URL` if your backend is on a different domain, and update `api.js` accordingly
