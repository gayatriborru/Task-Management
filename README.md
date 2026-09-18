# TaskFlow - Modern Full-Stack Task Management System

A production-grade, full-stack **Task Management System** built with **React.js**, **Tailwind CSS**, **Node.js**, **Express.js**, and **MongoDB Atlas** with robust JWT authentication and user data isolation.

---

## 🌟 Key Features

### 🔐 User Authentication & Security
- **User Registration & Login**: Secure credential handling with client-side and server-side validation.
- **Password Security**: Passwords salted and hashed with `bcryptjs`. Sensitive fields are stripped from all API outputs.
- **JWT Authentication**: Stateless JSON Web Token authentication with expiration and automatic session expiration handling.
- **Protected Routes**: Client-side React Router guard and backend Express middleware ensuring unauthorized requests receive `401 Unauthorized`.
- **User Data Isolation**: Every task is bound to the authenticated user's ID (`userId`). Users can only query, edit, or delete their own data.

### 📊 Modern SaaS Dashboard
- **Productivity Metrics**: Real-time calculated statistics:
  - **Total Tasks**
  - **Completed Tasks**
  - **In Progress Tasks**
  - **Pending Tasks**
  - **Overdue Tasks** (dynamically detected when past deadline)
  - **Completion Percentage** with visual progress indicator
- **Recent Tasks Feed**: Quick access to the most recently created or updated tasks.
- **Upcoming Deadlines Widget**: Direct visibility into upcoming deadlines.
- **Category & Priority Breakdown**: Visual distribution bars for workload balance.

### 📝 Task Management & Organization
- **Full CRUD Support**: Create, read, update, and delete tasks.
- **Task Attributes**:
  - Title & Detailed Multiline Description
  - Status (`Pending`, `In Progress`, `Completed`)
  - Priority (`Low`, `Medium`, `High`)
  - Category (e.g. `Work`, `Personal`, `Design`, `Development`, `Urgent`)
  - Due Date with overdue alerts
  - Custom comma-separated tags (e.g. `#frontend`, `#api`)
- **Quick Status Toggle**: 1-click completion check or quick status changer on cards and tables.
- **Search & Filters**:
  - Live search across title, description, category, and tags
  - Filter by Status, Priority, Category, and Due Date (`Due Today`, `Upcoming`, `Overdue`)
  - Sort by Recently Created, Due Date, Priority, and Title
- **Dual View Modes**: Switch seamlessly between **Grid (Card)** view and **Table (List)** view.
- **Dedicated Task Details View**: Full task page at `/tasks/:id` with inline editing mode and delete confirmation modal.

### 🎨 UI & UX Design
- Built with **Tailwind CSS** and **Lucide React** icons.
- Fully responsive layout optimized for Desktop, Tablet, and Mobile devices.
- Modern SaaS interface featuring slide-in mobile navigation, interactive modals, animated badge indicators, and floating toast notifications.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Axios |
| **Styling** | Tailwind CSS, Lucide React icons, date-fns |
| **Backend** | Node.js, Express.js, express-validator, morgan |
| **Database** | MongoDB Atlas / MongoDB with Mongoose ODM |
| **Authentication** | JSON Web Tokens (jsonwebtoken), bcryptjs |

---

## 📁 Project Directory Structure

```
task-management-system/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ConfirmationModal.jsx
│   │   │   ├── DashboardCard.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PriorityBadge.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskFormModal.jsx
│   │   │   └── TaskList.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global auth & notification state
│   │   ├── layouts/
│   │   │   ├── AppLayout.jsx   # Sidebar, Navbar, Toast & Outlet
│   │   │   └── AuthLayout.jsx  # Centered card layout for login/register
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   ├── TaskDetailsPage.jsx
│   │   │   └── TasksPage.jsx
│   │   ├── services/
│   │   │   ├── api.js          # Axios instance with JWT interceptors
│   │   │   ├── authService.js
│   │   │   └── taskService.js
│   │   ├── utils/
│   │   │   └── formatters.js   # Date, status, and priority formatters
│   │   ├── App.jsx             # Router definition
│   │   ├── index.css           # Tailwind directives & styles
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── .env
│
├── server/                     # Backend Express REST API
│   ├── config/
│   │   └── db.js               # Mongoose database connection
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, Me, Profile
│   │   └── taskController.js   # CRUD, Stats, Status update
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification middleware
│   │   ├── errorMiddleware.js  # 404 & centralized error handler
│   │   └── validateMiddleware.js # Input validation with express-validator
│   ├── models/
│   │   ├── Task.js             # Task Mongoose schema
│   │   └── User.js             # User schema with bcrypt pre-save
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth routes
│   │   └── taskRoutes.js       # /api/tasks routes
│   ├── utils/
│   │   └── generateToken.js    # JWT generation utility
│   ├── package.json
│   ├── server.js               # Express application entrypoint
│   ├── .env.example
│   └── .env
│
├── package.json                # Root package with concurrent dev scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- A **MongoDB Atlas** account (or local MongoDB instance)

---

### 2. Installation

You can install all dependencies (root, backend, and frontend) in one step:

```bash
# In the root directory:
npm run install:all
```

Or install dependencies manually:

```bash
# 1. Root dependencies
npm install

# 2. Server dependencies
cd server
npm install

# 3. Client dependencies
cd ../client
npm install
```

---

### 3. Environment Configuration

#### A. Backend Configuration (`server/.env`)
Copy `server/.env.example` to `server/.env` (already generated for you):

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/taskmanager?retryWrites=true&w=majority

# JWT Secrets
JWT_SECRET=taskmanager_super_secure_jwt_secret_key_2026_x89a1b2c3d4e5f
JWT_EXPIRES_IN=7d

# Allowed Client Origin
CLIENT_URL=http://localhost:5173
```

> **How to get your MongoDB Atlas URI:**
> 1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
> 2. Under your Database cluster, click **Connect**.
> 3. Choose **Drivers** (Node.js).
> 4. Copy the connection string and replace `<username>` and `<password>` with your database user credentials.
> 5. Ensure your IP address is whitelisted under **Network Access** (`0.0.0.0/0` for development).
> 6. *Note*: If testing locally, you can also use `mongodb://127.0.0.1:27017/taskmanager`.

#### B. Frontend Configuration (`client/.env`)
Copy `client/.env.example` to `client/.env`:

```env
VITE_API_BASE_URL=/api
```

---

### 4. Running the Application

You have two convenient ways to start the application:

#### Option 1: Run Both Concurrently (Recommended)
From the root folder:
```bash
npm run dev
```
This runs both the Express backend (`http://localhost:5000`) and the Vite React frontend (`http://localhost:5173`) concurrently.

#### Option 2: Run in Separate Terminals

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Log in and receive JWT token (`email`, `password`) |
| `GET` | `/api/auth/me` | Private | Get current authenticated user profile |
| `PUT` | `/api/auth/profile` | Private | Update user name and/or password |

### Tasks (`/api/tasks`)
*All task endpoints require `Authorization: Bearer <token>`.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | Get all tasks (supports `search`, `status`, `priority`, `category`, `dueDateFilter`, `sortBy`, `sortOrder`) |
| `GET` | `/api/tasks/stats` | Get dashboard metrics and productivity summary |
| `GET` | `/api/tasks/:id` | Get task by ID |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update task details |
| `PATCH` | `/api/tasks/:id/status`| Update status only (`Pending`, `In Progress`, `Completed`) |
| `DELETE`| `/api/tasks/:id` | Delete task |

#### Example Task Creation Request:
```json
POST /api/tasks
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "title": "Design System Implementation",
  "description": "Create reusable UI component tokens and badge styles",
  "status": "In Progress",
  "priority": "High",
  "category": "Development",
  "tags": ["frontend", "ui", "sprint-1"],
  "dueDate": "2026-10-15T00:00:00.000Z"
}
```

---

## 🧪 Testing the Application

1. **Register an Account**:
   - Go to `http://localhost:5173/register`
   - Enter your name, email, and a password (min 6 characters)
   - Click **Create Account**
2. **Explore the Dashboard**:
   - Notice the greeting banner, completion percentage, and 0 tasks initial state
3. **Create Tasks**:
   - Click the **+ Add Task** button in the top navigation bar or **New Task** button on the Tasks page
   - Add tasks with different priorities (`High`, `Medium`, `Low`) and statuses (`Pending`, `In Progress`, `Completed`)
   - Add categories like `Work`, `Personal`, `Urgent`
   - Add due dates (try setting one to yesterday to test overdue detection)
4. **Test Search & Filters**:
   - Use the search bar to filter by title or tag
   - Use the **Filters** panel to filter by priority, status, or deadline
   - Switch between **Grid View** and **Table View**
5. **Test Task Details & Inline Editing**:
   - Click on any task card to open the dedicated Task Details page (`/tasks/:id`)
   - Change the status dropdown or click **Edit Task** to modify details directly
6. **Test Responsive Mobile View**:
   - Resize browser window or view on mobile to test the drawer sidebar and collapsible menus.

