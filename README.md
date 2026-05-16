# Team Task Manager

**🌍 Live Demo:** [https://team-task-manager-mu4a.vercel.app/](https://team-task-manager-mu4a.vercel.app/)

### 🔑 Test Credentials
Feel free to use the following credentials to explore the application:
- **Member**
  - Email: `yuvraj123@gmail.com`
  - Password: `yuvraj123`
- **Admin**
  - Email: `satyam123@gmail.com`
  - Password: `satyam123`

---

Team Task Manager is a full-stack, role-based project management application designed to streamline collaboration between administrators and team members. It provides a robust backend API and a modern, responsive frontend interface.

## 🚀 Features

- **Role-Based Access Control**: Strict segregation between Global Admins, Project Admins, and standard Members.
- **Admin Portal**: 
  - **Dashboard**: High-level overview of managed projects, active tasks, and quick-create tools.
  - **Project Management**: Create new projects and instantly assign yourself as the manager.
  - **Team Management**: Add members to specific projects, assign roles, and monitor team capacity limits.
- **Member Workspace**: 
  - Personalized dashboard showing assigned tasks and active projects.
  - Interactive status updates (To Do → In Progress → Done).
  - Visual summary of weekly progress and analytics.
- **Secure Authentication**: JWT-based authentication system with dedicated login/registration flows for Admins and Members.

---

## 🛠️ Technology Stack

**Backend**
- Python / Django 
- Django REST Framework (DRF)
- SQLite (Default Database)
- SimpleJWT (JSON Web Tokens)
- Django CORS Headers

**Frontend**
- Next.js (App Router)
- React
- Vanilla CSS (CSS Modules for scoped styling)
- Modern UI/UX (Inter typeface, Slate/Action Blue color palette)

---

## 📂 Project Structure

```text
Team-Task-Manager/
├── backend/                  # Django REST API
│   ├── api/                  # Main application containing core logic
│   │   ├── models/           # Database schema (User, Project, Task, Membership)
│   │   ├── serializers/      # DRF serializers mapping models to JSON
│   │   ├── views/            # API endpoint controllers (Auth, Admin, Member)
│   │   ├── migrations/       # Database migration files
│   │   ├── urls.py           # API route declarations
│   │   └── permissions.py    # Custom access control logic
│   ├── core/                 # Django project settings and core configuration
│   │   ├── settings.py       # Configuration (Installed apps, CORS, DB, JWT config)
│   │   ├── urls.py           # Root URL router
│   │   └── asgi.py / wsgi.py # Deployment gateways
│   ├── manage.py             # Django execution script
│   └── db.sqlite3            # Local SQLite database
│
└── frontend/                 # Next.js Application
    ├── app/                  # Next.js App Router root
    │   ├── admin/            # Admin-only routes (Dashboard, Team, Projects)
    │   ├── member/           # Member-only routes (Workspace, Task Details)
    │   ├── login/            # Authentication interfaces
    │   ├── register/         # Account creation flows
    │   ├── globals.css       # Global design system variables and typography
    │   └── layout.js         # Root HTML structure
    ├── services/             # API client and logic
    │   └── api.js            # Centralized Axios/Fetch wrapper and auth handling
    └── public/               # Static assets (images, icons)
```

---

## ⚙️ Local Setup & Installation

Follow these steps to get both the backend and frontend running on your local machine.

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### 1. Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd Team-Task-Manager/backend
   ```

2. Create and activate a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the required dependencies:
   ```bash
   pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
   ```

4. Apply database migrations:
   ```bash
   python manage.py migrate
   ```

5. (Optional) Create a superuser account for the Django Admin panel:
   ```bash
   python manage.py createsuperuser
   ```

6. Start the Django development server:
   ```bash
   python manage.py runserver
   ```
   *The API will be available at `[Your Deployed Backend URL]/api/` (or `http://localhost:8000/api/` locally)*

### 2. Frontend Setup

1. Open a **new** terminal window and navigate to the frontend directory:
   ```bash
   cd Team-Task-Manager/frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The web application will be available at `[Your Deployed Frontend URL]` (or `http://localhost:3000` locally)*

---

## 📖 Core Code Concepts

### 1. The Membership Model (`backend/api/models/membership.py`)
This is the heart of the application's authorization. It acts as a bridge between `Users` and `Projects`. A user only has access to a project if a `Membership` record exists linking them together. Furthermore, the `role` field within this model (`Admin` vs `Member`) dictates what actions the user can perform within that specific project.

### 2. Centralized API Service (`frontend/services/api.js`)
Instead of scattering `fetch()` calls across components, all network requests are handled through `api.js`. This ensures that JWT tokens are automatically injected into the `Authorization` header via the `getAuthHeaders()` helper, and provides a single source of truth for error handling and token management.

### 3. CSS Modules (`*.module.css`)
To prevent class name collisions and maintain a clean global scope, this project heavily utilizes CSS Modules. Components import their specific `styles` object, ensuring that classes like `.card` or `.title` only apply to the component they were written for, while still allowing access to global CSS variables defined in `globals.css` (like `--color-blue-600` or `--shadow-md`).

---

## 🔑 Default Roles & Access
To explore the application, you can use the registration pages to create accounts.
- **Admin**: Register via `/register/admin`. Admins have access to the `/admin/dashboard` where they can create projects, assign tasks, and invite members.
- **Member**: Register via `/register`. Members log into `/member/workspace` where they can view tasks assigned to them by their project admins and update task statuses.