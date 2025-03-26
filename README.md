# Todo App Backend

A RESTful API backend for a Todo application built with Express.js, PostgreSQL, and JWT authentication.

## Features

- 🔐 User Authentication (JWT)
- 👤 User Management
- ✅ Todo CRUD Operations
- 🔄 Token Refresh System
- ⏰ Deadline Tracking

## API Endpoints

### Authentication Routes

```
POST /api/users/register - Register a new user
POST /api/users/login - User login
POST /api/users/logout - User logout 
GET /api/users/profile - Get user profile 
DELETE /api/users/delete - Delete user account 
POST /api/users/refresh-token - Refresh access token
```

### Todo Routes

```
GET /api/todos - Get all todos 
POST /api/todos - Create new todo 
GET /api/todos/:id - Get specific todo 
PUT /api/todos/:id - Update todo 
DELETE /api/todos/:id - Delete todo
```



## Project Structure

```
todo-app-backend/
├── controllers/
│   ├── authController.js
│   └── todoController.js
├── models/
│   ├── userModel.js
│   └── todoModel.js
├── routes/
│   ├── authRoutes.js
│   └── todoRoutes.js
├── config/
│   └── db.js
├── .env
├── package.json
└── index.js
```
