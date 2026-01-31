# 🏋️ Workout Tracker

A full-stack web application for tracking workouts and exercises. Built with Node.js, Express, MongoDB, and Bootstrap 5.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Screenshots](#screenshots)

## ✨ Features

- **User Authentication**: Register and login with JWT-based authentication
- **Role-Based Access Control**: Admin-only operations for creating, editing, and deleting workouts/exercises
- **Workout Management**: Full CRUD operations for workouts
- **Exercise Management**: Full CRUD operations for exercises linked to workouts
- **Search & Filter**: Search workouts by title/description, filter by difficulty level
- **Pagination**: Paginated results (10 items per page)
- **Responsive Design**: Bootstrap 5 responsive UI that works on all screen sizes
- **Modern Frontend**: ES6 modules, dynamic DOM updates, toast notifications

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database**: MongoDB with Mongoose 9
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **CORS**: cors

### Frontend
- **HTML5** with semantic markup
- **CSS3** with custom styles
- **Bootstrap 5** for responsive design
- **Bootstrap Icons** for iconography
- **Vanilla JavaScript** with ES6 modules

## 📁 Project Structure

```
workout-tracker/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic (register, login, profile)
│   │   ├── workoutController.js  # Workout CRUD operations
│   │   └── exerciseController.js # Exercise CRUD operations
│   ├── middleware/
│   │   ├── authenticate.js       # JWT verification
│   │   ├── authorize.js          # Role-based access control
│   │   └── errorHandler.js       # Global error handler
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Workout.js            # Workout schema
│   │   └── Exercise.js           # Exercise schema
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── workouts.js           # Workout routes
│   │   └── exercises.js          # Exercise routes
│   ├── seed.js                   # Admin seed script
│   └── server.js                 # Express app entry point
├── frontend/
│   ├── css/
│   │   └── styles.css            # Custom styles
│   ├── js/
│   │   ├── api/
│   │   │   ├── auth.js           # Auth API calls
│   │   │   ├── workouts.js       # Workouts API calls
│   │   │   └── exercises.js      # Exercises API calls
│   │   ├── ui/
│   │   │   ├── auth.js           # Auth UI handling
│   │   │   └── workouts.js       # Workouts UI rendering
│   │   ├── utils/
│   │   │   └── helpers.js        # Utility functions
│   │   ├── config.js             # Frontend configuration
│   │   ├── state.js              # Auth state management
│   │   └── main.js               # Entry point
│   └── index.html                # Main HTML file
├── images/                       # Screenshot images
├── .env                          # Environment variables (create from .env.example)
├── .env.example                  # Environment template
├── package.json                  # Dependencies and scripts
├── postman_collection.json       # Postman API tests
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LatievA/backend-course.git
   cd backend-course
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

4. **Seed the admin user**
   ```bash
   npm run seed
   ```
   This creates an admin user with:
   - Email: `admin@example.com`
   - Password: `admin123`

5. **Start the server**
   ```bash
   npm start
   ```

6. **Open the application**
   
   Navigate to `http://localhost:3000` in your browser.

## ⚙️ Environment Variables

Create a `.env` file based on `.env.example`:

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/workout-tracker` |
| `JWT_SECRET` | Secret key for JWT signing | (required) |
| `JWT_EXPIRES_IN` | JWT token expiration | `1d` |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds | `10` |
| `PORT` | Server port | `3000` |
| `CORS_ORIGIN` | Allowed CORS origins | `*` |
| `ADMIN_EMAIL` | Admin seed email | `admin@example.com` |
| `ADMIN_PASSWORD` | Admin seed password | `admin123` |
| `ADMIN_NAME` | Admin seed name | `Administrator` |

## 📚 API Documentation

Base URL: `http://localhost:3000/api`

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Login and receive JWT token |
| `GET` | `/auth/me` | User | Get current user profile |
| `PUT` | `/auth/me` | User | Update current user profile |

### Workout Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/workouts` | Public | List all workouts (paginated) |
| `GET` | `/workouts/:id` | Public | Get workout by ID |
| `POST` | `/workouts` | Admin | Create a new workout |
| `PUT` | `/workouts/:id` | Admin | Update workout |
| `DELETE` | `/workouts/:id` | Admin | Delete workout (cascades to exercises) |

**Query Parameters for GET /workouts:**
- `search` - Search by title or description
- `difficulty` - Filter by `Beginner`, `Intermediate`, or `Advanced`
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 50)

### Exercise Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/exercises` | Public | List all exercises (paginated) |
| `GET` | `/exercises/:id` | Public | Get exercise by ID |
| `POST` | `/exercises` | Admin | Create a new exercise |
| `PUT` | `/exercises/:id` | Admin | Update exercise |
| `DELETE` | `/exercises/:id` | Admin | Delete exercise |

**Query Parameters for GET /exercises:**
- `search` - Search by name
- `workout` - Filter by workout ID
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 50)

### Request/Response Examples

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "role": "user",
    "name": "John Doe"
  }
}
```

#### Create Workout (Admin)
```http
POST /api/workouts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Full Body HIIT",
  "duration": 30,
  "difficulty": "Intermediate",
  "description": "High intensity interval training for full body"
}
```

#### List Workouts with Search
```http
GET /api/workouts?search=HIIT&difficulty=Intermediate&page=1&limit=10
```

Response:
```json
{
  "data": [...],
  "page": 1,
  "limit": 10,
  "total": 5,
  "totalPages": 1
}
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Getting a Token
1. Register a new account or login with existing credentials
2. The response includes a `token` field

### Using the Token
Include the token in the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

### Role-Based Access
- **User**: Can register, login, view workouts/exercises, update own profile
- **Admin**: All user permissions + create, update, delete workouts and exercises

**Note**: Admin accounts can only be created via the seed script (`npm run seed`). Regular registration always creates user accounts.

## 📸 Screenshots

### Login Form
![Login](./images/Снимок%20экрана%20(334).png)

### Workout List
![Workouts](./images/Снимок%20экрана%20(335).png)

### API Examples
![API Example 1](./images/Снимок%20экрана%20(336).png)
![API Example 2](./images/Снимок%20экрана%20(337).png)

---

## 📝 License

ISC

## 👤 Author

**Abylay Latiyev**

- GitHub: [@LatievA](https://github.com/LatievA)
