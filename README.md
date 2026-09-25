# TaskFlow — Full-Stack Todo Application (React + Node.js Express MVC + Supabase PostgreSQL)

A secure, production-ready Full-Stack Todo Application architected with a decoupled **React.js** frontend, an **Express.js MVC** REST API backend, and a cloud **Supabase PostgreSQL** database guarded with **Row Level Security (RLS)** and **bcrypt** password hashing.

---

## 1. Project Overview

TaskFlow is designed following strict enterprise architectural principles:
- **Total Frontend/Backend Separation:** The React client never communicates directly with the database; all operations pass through an Express REST API.
- **MVC (Model-View-Controller) Pattern:** The backend strictly isolates database queries (Models), business logic (Services), and HTTP request/response lifecycles (Controllers).
- **Stateless JWT Authentication:** Users register and log in with email and password. Passwords are salted and hashed using bcrypt (12 rounds). JSON Web Tokens (JWT) are signed and verified on every protected request.
- **Database-Level Row Security:** Supabase PostgreSQL tables (`users`, `todos`) enforce Row Level Security (RLS) with declarative policies ensuring users can only read, create, update, and delete their own records.
- **Privileged Credential Isolation:** The `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to the backend environment and is never bundled into client-side code.

---

## 2. Technologies Used

### Frontend
- **React.js (v18)** — Component-driven declarative UI
- **React Router DOM (v6)** — Client-side routing with guarded route wrappers
- **Vanilla CSS (Modern Design System)** — Custom CSS variables, glassmorphic navbar, responsive layouts, micro-animations, and status badges
- **Webpack 5 & Babel** — Module bundling and modern JSX compilation

### Backend
- **Node.js (v20+) & Express.js (v4)** — Fast, lightweight RESTful API framework
- **@supabase/supabase-js** — PostgreSQL client library connecting securely with the database
- **bcryptjs** — Industry-standard salted password hashing
- **jsonwebtoken** — Cryptographic JWT signing and verification
- **cors & dotenv** — Cross-Origin Resource Sharing control and environment configuration

### Database
- **Supabase PostgreSQL (v17)** — Hosted relational database
- **Row Level Security (RLS)** — Granular table-level authorization
- **Automated Triggers** — Real-time `updated_at` timestamps

---

## 3. Architecture

```text
                           TASKFLOW FULL-STACK ARCHITECTURE
                                          │
               ┌──────────────────────────┴──────────────────────────┐
               │                                                     │
               ▼                                                     ▼
        frontend-todo                                          backend-todo
          (React.js)                                         (Express.js MVC)
       Port: 3000 (Dev)                                      Port: 5000 (Dev)
               │                                                     │
               │ HTTP REST Requests                                  │
               │ (Authorization: Bearer <jwt>)                       │
               └──────────────────────────┬──────────────────────────┘
                                          ▼
                                   routes/
                           (authRoutes, todoRoutes)
                                          │
                                          ▼
                                 middleware/
                        (authMiddleware, errorMiddleware)
                                          │
                                          ▼
                                controllers/
                       (authController, todoController)
                                          │
                                          ▼
                                  services/
                         (authService, todoService)
                                          │
                                          ▼
                                   models/
                            (userModel, todoModel)
                                          │
                                          ▼
                                  config/
                               (supabase.js)
                                          │
                                          ▼
                            Supabase PostgreSQL Database
                        ┌─────────────────┴─────────────────┐
                        │                                   │
                        ▼                                   ▼
                  public.users                        public.todos
                  (RLS Enabled)                       (RLS Enabled)
```

---

## 4. Folder Structure

```text
todo-application/
│
├── frontend-todo/                      # React Application
│   ├── public/
│   │   └── index.html                  # HTML template with Google Fonts (Inter)
│   ├── src/
│   │   ├── components/                 # Reusable UI Components
│   │   │   ├── ErrorMessage.js         # Dismissible alert banner
│   │   │   ├── Loading.js              # Animated loading spinner
│   │   │   ├── Navbar.js               # Header navigation & user session badge
│   │   │   ├── ProtectedRoute.js       # Route guard redirecting to /login
│   │   │   ├── TodoForm.js             # Form for creating new tasks
│   │   │   ├── TodoItem.js             # Task card with toggle, inline edit & delete
│   │   │   └── TodoList.js             # Filter tabs, search bar, stats & list
│   │   ├── context/
│   │   │   └── AuthContext.js          # Authentication state & session provider
│   │   ├── hooks/
│   │   │   └── useAuth.js              # Custom hook for consuming AuthContext
│   │   ├── pages/
│   │   │   ├── LoginPage.js            # Login form page
│   │   │   ├── RegisterPage.js         # User registration page
│   │   │   └── TodosPage.js            # Main authenticated dashboard
│   │   ├── services/
│   │   │   ├── api.js                  # Base fetch client with JWT auto-injection
│   │   │   ├── authService.js          # Auth API calls (login, register, getMe)
│   │   │   └── todoService.js          # Todo CRUD API calls
│   │   ├── utils/
│   │   │   └── storage.js              # LocalStorage helpers for tokens & user cache
│   │   ├── App.js                      # Route tree configuration
│   │   ├── index.css                   # Vanilla CSS Design System
│   │   └── index.js                    # React DOM entry point
│   ├── .babelrc                        # Babel configuration
│   ├── .env                            # Active environment variables (git-ignored)
│   ├── .env.example                    # Environment template
│   ├── .gitignore                      # Git ignore rules for frontend
│   ├── package.json                    # Frontend dependencies & scripts
│   └── webpack.config.js               # Webpack 5 development & build configuration
│
├── backend-todo/                       # Express.js REST API Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js             # Supabase client initialization
│   │   ├── controllers/
│   │   │   ├── authController.js       # Register, login, getMe, logout handlers
│   │   │   └── todoController.js       # Todo CRUD request/response handlers
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js       # JWT extraction & verification guard
│   │   │   └── errorMiddleware.js      # 404 handler & centralized error handler
│   │   ├── models/
│   │   │   ├── todoModel.js            # Database queries for 'todos' table
│   │   │   └── userModel.js            # Database queries for 'users' table
│   │   ├── routes/
│   │   │   ├── authRoutes.js           # /api/auth routes
│   │   │   ├── healthRoutes.js         # /api/health endpoint
│   │   │   └── todoRoutes.js           # /api/todos protected routes
│   │   ├── services/
│   │   │   ├── authService.js          # Authentication business logic & bcrypt hashing
│   │   │   └── todoService.js          # Todo business logic & ownership validation
│   │   ├── utils/
│   │   │   ├── apiResponse.js          # Standardized { success, message, data } responder
│   │   │   └── token.js                # JWT signing & verification utilities
│   │   ├── app.js                      # Express application setup & middleware stack
│   │   └── server.js                   # Server entry point & listener
│   ├── .env                            # Active backend environment variables (git-ignored)
│   ├── .env.example                    # Backend environment template
│   ├── .gitignore                      # Git ignore rules for backend
│   ├── package.json                    # Backend dependencies & scripts
│   └── test_backend.js                 # Automated API test suite
│
├── README.md                           # Complete project documentation
└── .gitignore                          # Root git ignore rules
```

---

## 5. Supabase Setup & Database Schema

The database was configured using the project's Supabase PostgreSQL instance:
- **Project URL:** `https://wqxpdprcvhmogvjwpzhy.supabase.co`
- **Region:** `ap-southeast-2`

### Database Schema SQL

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 2. Todos Table
CREATE TABLE IF NOT EXISTS public.todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_todos_user_id ON public.todos(user_id);

-- 3. Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp;

CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_todos_updated_at
    BEFORE UPDATE ON public.todos
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
```

---

## 6. Row Level Security (RLS) Policies

Row Level Security is enabled on all tables:
```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
```

### Table `public.users` Policies
1. **Users can view their own profile:**
   ```sql
   CREATE POLICY "Users can view their own profile"
       ON public.users FOR SELECT
       USING (auth.uid() = id);
   ```
2. **Users can update their own profile:**
   ```sql
   CREATE POLICY "Users can update their own profile"
       ON public.users FOR UPDATE
       USING (auth.uid() = id)
       WITH CHECK (auth.uid() = id);
   ```

### Table `public.todos` Policies
1. **Users can view their own todos:**
   ```sql
   CREATE POLICY "Users can view their own todos"
       ON public.todos FOR SELECT
       USING (auth.uid() = user_id);
   ```
2. **Users can create their own todos:**
   ```sql
   CREATE POLICY "Users can create their own todos"
       ON public.todos FOR INSERT
       WITH CHECK (auth.uid() = user_id);
   ```
3. **Users can update their own todos:**
   ```sql
   CREATE POLICY "Users can update their own todos"
       ON public.todos FOR UPDATE
       USING (auth.uid() = user_id)
       WITH CHECK (auth.uid() = user_id);
   ```
4. **Users can delete their own todos:**
   ```sql
   CREATE POLICY "Users can delete their own todos"
       ON public.todos FOR DELETE
       USING (auth.uid() = user_id);
   ```

---

## 7. Environment Variables Configuration

### Backend (`backend-todo/.env`)

```env
PORT=5000
SUPABASE_URL=https://wqxpdprcvhmogvjwpzhy.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE
JWT_SECRET=antigravity_super_secret_jwt_key_todo_application_2026
FRONTEND_URL=http://localhost:3000
```

> **How to get your `SUPABASE_SERVICE_ROLE_KEY`:**
> 1. Visit your Supabase Dashboard: [https://supabase.com/dashboard/project/wqxpdprcvhmogvjwpzhy/settings/api](https://supabase.com/dashboard/project/wqxpdprcvhmogvjwpzhy/settings/api)
> 2. Under **Project API keys**, locate the `service_role` key (marked **secret**).
> 3. Copy the key and paste it as `SUPABASE_SERVICE_ROLE_KEY` in `backend-todo/.env`.

### Frontend (`frontend-todo/.env`)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 8. Installation & Local Development

Run the full stack application using two terminal windows:

### Terminal 1 — Backend Server

```bash
cd backend-todo
npm install
npm run dev
```

* Backend server will start at: `http://localhost:5000`
* Health Check: `http://localhost:5000/api/health`

### Terminal 2 — Frontend Application

```bash
cd frontend-todo
npm install
npm start
```

* Frontend application will start at: `http://localhost:3000`

---

## 9. API Documentation

### Standard Response Format

**Success Response (HTTP 200/201):**
```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "todo": {
      "id": "c1f76d20-b484-4869-8086-4556a310bb24",
      "user_id": "31efea41-2b0e-44db-aa2f-c5798935c1ba",
      "title": "Build production app",
      "description": "Express + React + Supabase",
      "completed": false,
      "created_at": "2026-09-25T07:30:00.000Z",
      "updated_at": "2026-09-25T07:30:00.000Z"
    }
  }
}
```

**Error Response (HTTP 400/401/403/404/409/500):**
```json
{
  "success": false,
  "message": "Invalid email or password."
}
```

---

### Endpoints Overview

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/api/health` | No | System health check |
| `POST` | `/api/auth/register` | No | Register a new user |
| `POST` | `/api/auth/login` | No | Authenticate & retrieve JWT |
| `GET` | `/api/auth/me` | **Yes** | Fetch current user's profile |
| `POST` | `/api/auth/logout` | No | Log out session |
| `GET` | `/api/todos` | **Yes** | Fetch all todos for authenticated user |
| `POST` | `/api/todos` | **Yes** | Create a new todo |
| `GET` | `/api/todos/:id` | **Yes** | Fetch a single todo by ID |
| `PUT` | `/api/todos/:id` | **Yes** | Update a todo (title, description, completed) |
| `DELETE` | `/api/todos/:id` | **Yes** | Delete a todo |

---

## 10. API Testing with cURL

### 1. Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vinay Kumar",
    "email": "vinay@example.com",
    "password": "Password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vinay@example.com",
    "password": "Password123"
  }'
```
*Extract the `"token"` from the response for the following requests.*

### 3. Get Current User Profile
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Create a Todo
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Learn Node.js",
    "description": "Study Express MVC architecture"
  }'
```

### 5. Get User's Todos
```bash
curl -X GET http://localhost:5000/api/todos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Update a Todo
```bash
curl -X PUT http://localhost:5000/api/todos/TODO_UUID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "completed": true
  }'
```

### 7. Delete a Todo
```bash
curl -X DELETE http://localhost:5000/api/todos/TODO_UUID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 11. Security Checklist

- [x] **Password Protection:** Stored using salted bcrypt hashes (12 rounds). Plaintext passwords are never stored.
- [x] **Data Isolation:** User ID is extracted from the verified JWT on the server. The frontend cannot inject or override `user_id`.
- [x] **Row Level Security:** Database-level RLS policies strictly limit operations to record owners.
- [x] **Credential Confidentiality:** Service role key is confined to `backend-todo/.env` and excluded from git tracking.
- [x] **Cross-Origin Security:** CORS middleware restricts API communication to authorized frontend origins.
- [x] **Input Sanitization:** All incoming request payloads are validated and trimmed.
- [x] **Information Disclosure:** Server errors hide sensitive stack traces in production environments.

---

## 12. Automated Testing

Run the backend test suite:
```bash
cd backend-todo
npm test
```

Tests verify:
- JWT token signing & verification
- Bcrypt password hashing & validation
- Health check status code & response payload
- Centralized 404 handler for unknown routes
- Registration validation (missing fields, invalid email format, short password)
- Login validation (missing fields)
- Unauthorized request rejection (401)
- Forged/invalid JWT token rejection (401)

---

## 13. Production Deployment

### Backend (e.g. Render, Railway, DigitalOcean App Platform)
1. Set the root directory to `backend-todo`.
2. Build command: `npm install`
3. Start command: `npm start`
4. Set environment variables in the dashboard:
   - `PORT=5000`
   - `SUPABASE_URL=https://wqxpdprcvhmogvjwpzhy.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY=your_secret_key`
   - `JWT_SECRET=your_production_secret`
   - `FRONTEND_URL=https://your-frontend-domain.com`

### Frontend (e.g. Vercel, Netlify, Cloudflare Pages)
1. Set the root directory to `frontend-todo`.
2. Build command: `npm run build`
3. Publish directory: `build`
4. Set environment variables:
   - `REACT_APP_API_URL=https://your-backend-domain.com/api`
