# 🚀 Spring Flow — Project Management & Team Collaboration Tool

Spring Flow is a high-performance, full-stack project management application designed for agile teams. It features dual-role functionality (Manager & Developer), real-time task tracking, and comprehensive project analytics.

🔗 **Live Application:** [https://codsoft-1-rmuo.onrender.com/](https://codsoft-1-rmuo.onrender.com/)  
🔗 **API Server:** [https://codsoft-6ss2.onrender.com](https://codsoft-6ss2.onrender.com)

---

## ✨ Features

### 👔 Manager Suite
- **Interactive Dashboard** — Quick overview of active projects, team size, and pending approvals.
- **Project Creation** — Define new projects with metadata and objectives.
- **Developer Fleet** — Monitor team workload, experience levels, and current progress in real-time.
- **Task Assignment** — Assign specific "Flows" (tasks) to developers with priority levels and deadlines.
- **Task Approval** — Review and approve completed tasks to close the loop.

### 💻 Developer Experience
- **Task Section** — Clean list of assigned flows with status indicators.
- **Status Updates** — Move tasks through the lifecycle: `Todo` → `In-Progress` → `Review`.
- **Project Analytics** — View project-wide statistics and progress bars.
- **Personal Profile** — Manage professional bio, tech stack, and experience history.

### 🛠️ Core Functionality
- **Dual-Role Auth** — Role-based access control (RBAC) ensuring managers and developers see what they need.
- **Glassmorphism UI** — Stunning, modern dark-themed interface with high-end aesthetics.
- **Real-time Health Check** — Built-in server diagnostics at `/api/health`.
- **Responsive Navigation** — Collapsible sidebar and mobile-friendly layouts.

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI Library |
| **React Router** | Client-side routing with `_redirects` support |
| **Tailwind CSS** | Styling with a premium dark-mode aesthetic |
| **Context API** | Global state management for auth and project context |
| **Lucide React** | Icon system |
| **Vite** | Lightning-fast build tool |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express 5** | Web framework with improved path-to-regexp support |
| **MongoDB** | NoSQL Database for flexible project schemas |
| **Mongoose** | Object Data Modeling (ODM) |
| **JWT** | Secure token-based authentication |
| **Morgan** | Request logging for development monitoring |

---

## 📁 Project Structure

```
Project-management-tool/
├── client/                   # React Frontend
│   ├── src/
│   │   ├── components/       # UI Components (Sidebar, Navbar, etc.)
│   │   ├── pages/            # View-level components
│   │   │   ├── ManagerDashboard.jsx
│   │   │   ├── DevelopersPage.jsx
│   │   │   ├── TasksPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── AppContext.jsx     # Auth & Global State
│   │   └── apiConfig.js      # Centralized environment config
│   ├── public/
│   │   └── _redirects        # Render SPA routing fix
│   └── vite.config.js
│
└── server/                   # Express Backend
    ├── config/               # Database connection strings
    ├── controllers/          # Business logic handlers
    ├── models/               # Mongoose schemas (User, Project, Task)
    ├── routes/               # API endpoints
    └── app.js                # Server entry point
```

---

## 🚀 Installation & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/Saqlain532/CODSOFT.git
cd CODSOFT/Project-management-tool
```

### 2. Server Configuration
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=8080
```
Run the server:
```bash
npm run dev
```

### 3. Client Configuration
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:8080/api
```
Run the client:
```bash
npm run dev
```

---

## 🌐 Deployment Details

### **Server (Node.js)**
- **Platform:** Render (Web Service)
- **Root Directory:** `Project-management-tool/server`
- **Build Command:** `npm install`
- **Start Command:** `node app.js`

### **Frontend (Vite)**
- **Platform:** Render (Static Site)
- **Root Directory:** `Project-management-tool/client`
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **SPA Fix:** Uses `_redirects` file in the `public` folder for React Router support.

---

## 🔐 API Routes

### Users & Auth
- `POST /api/users/signup` — Register new account.
- `POST /api/users/login` — Access token generation.
- `GET /api/users/me` — Get current user profile.
- `GET /api/users/developers` — List all developers (Manager only).

### Projects
- `POST /api/projects` — Create new project (Manager only).
- `GET /api/projects` — Get all relevant projects.

### Tasks
- `POST /api/tasks` — Assign task to dev.
- `GET /api/tasks/project/:id` — View all tasks for a project.
- `PATCH /api/tasks/:id/status` — Update task lifecycle state.

---

## 📄 License
This project is part of the CODSOFT Internship program. Created by Saqlain.
