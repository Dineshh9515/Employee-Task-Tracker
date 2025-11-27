# Employee Task Tracker

A production-ready fullstack web application for managing employee tasks, featuring role-based authentication, a dashboard with workload analysis, and a complete REST API.

## Tech Stack

- **Frontend:** React (Vite), React Router, Context API, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas (Mongoose)
- **Authentication:** JWT (JSON Web Tokens) + Passport.js (Local, GitHub, Google)

## Features

- **Role-Based Access Control:**
  - **Admin:** Manage employees, create/assign tasks, view all data.
  - **User:** View assigned tasks, update task status.
- **Authentication Options:**
  - Email/Password Login
  - GitHub OAuth
  - Google OAuth
- **Dashboard:** Real-time summary of tasks, completion rates, and workload analysis.
- **Workload & Burnout Indicator:** Visual heatmap showing employee workload levels based on open and overdue tasks.
- **Task Management:** Filterable lists, priority levels, due dates.

## Project Structure

```
/client  - React Frontend
/server  - Node.js Backend API
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB Atlas Account

### 1. Clone the Repository

```bash
git clone <repository-url>
cd employee-task-tracker
```

### 2. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   npm install
   ```

2. Create a `.env` file in the `/server` directory based on `.env.example`:
   ```
   MONGODB_URI=mongodb+srv://<db_user_id>:<db_password>@cluster0.hcxskcz.mongodb.net/?appName=Cluster0
   JWT_SECRET=your_super_secret_key_123
   PORT=5000
   CLIENT_URL=http://localhost:5173
   ```
   *Replace `<username>` and `<password>` with your MongoDB Atlas credentials.*

   **OAuth Configuration (Optional):**
   To enable GitHub and Google login, add the following to your `.env`:
   ```
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   ```
   - **GitHub:** Register a new OAuth App in GitHub Developer Settings. Set Authorization callback URL to `http://localhost:5000/api/auth/github/callback`.
   - **Google:** Create a project in Google Cloud Console, enable Google+ API (or People API), and create OAuth credentials. Set Authorized redirect URI to `http://localhost:5000/api/auth/google/callback`.

3. (Optional) Seed the database with sample data:
   ```bash
   npm run seed
   ```
   *This creates an Admin user (`admin@example.com` / `admin123`) and a Regular user (`john@example.com` / `user123`).*

4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   npm install
   ```

2. Create a `.env` file in the `/client` directory based on `.env.example`:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`.

## API Documentation

### Auth
- `POST /api/auth/login` - Login user (Email/Password)
- `POST /api/auth/register` - Register new user (Admin only)
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/github` - Login with GitHub
- `GET /api/auth/google` - Login with Google

### Employees (Admin Only)
- `GET /api/employees` - List all employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Tasks
- `GET /api/tasks` - List all tasks (Admin)
- `GET /api/tasks/my` - List assigned tasks (User)
- `POST /api/tasks` - Create task (Admin)
- `PUT /api/tasks/:id` - Update task (Admin: all fields, User: status only)
- `DELETE /api/tasks/:id` - Delete task (Admin)

### Dashboard
- `GET /api/dashboard/summary` - Get stats and workload data

## Deployment

### 1. MongoDB Atlas
1. Create a Cluster on MongoDB Atlas.
2. Whitelist `0.0.0.0/0` (or your production IP) in Network Access.
3. Get the connection string.

### 2. Backend (e.g., Render)
1. Create a new Web Service connected to your repo (`/server` root).
2. Add Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (your frontend URL).
3. Build Command: `npm install`
4. Start Command: `node server.js`

### 3. Frontend (e.g., Vercel)
1. Import the repo and select `/client` as the root directory.
2. Add Environment Variable: `VITE_API_BASE_URL` (your backend URL).
3. Build Command: `npm run build`
4. Output Directory: `dist`

## Assumptions
- Users are manually linked to Employee records by Admins (handled automatically in the seed script for demo).
- Deleting an employee does not cascade delete their tasks (tasks remain unassigned or need manual reassignment).
