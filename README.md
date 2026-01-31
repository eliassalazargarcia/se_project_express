# WTWR (What to Wear?) - Backend API

## Project Overview

**WTWR** is a full-stack application that helps users decide what to wear based on weather conditions. This repository contains the **backend API server** built with Node.js, Express, and MongoDB.

The API provides user authentication, clothing item management, and social features like liking items.

---

## Deployed Project

- **Backend API:** http://api.finalsprint.jumpingcrab.com
- **Frontend:** http://finalsprint.jumpingcrab.com
- **Frontend Repository:** https://github.com/eliassalazargarcia/se_project_react

---

## Project Demo Video

**[Click here to watch my project presentation video](https://drive.google.com/file/d/1rhxkET93XeYV7aAaqgd5t_oSqKwhsM-j/view?usp=sharing)**

> _In this video, I demonstrate the key features of the WTWR full-stack application, explain the authentication flow, and show how the frontend and backend work together._

---

## Features

### Core Functionality
- User Authentication: Secure signup and login with JWT tokens
- Clothing Item Management: Create, read, update, and delete clothing items
- Item Ownership: Users can only delete their own items
- Social Features: Like and unlike clothing items
- Weather-Based Categorization: Items are tagged with appropriate weather conditions
- Authorization Middleware: Protected routes require valid authentication
- Password Security: Bcrypt hashing for secure password storage
- Input Validation: Server-side validation using Celebrate and Joi
- Centralized Error Handling: Custom error classes with consistent error responses
- Request/Error Logging: Winston logging to request.log and error.log files
- CORS Enabled: Ready for frontend integration

---

## Technologies Used

### Backend Stack
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Security & Validation
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication tokens
- **validator** - Email and URL validation
- **celebrate** - Request validation middleware
- **Joi** - Schema validation

### Logging
- **winston** - Logging library
- **express-winston** - Express middleware for winston

### Development Tools
- **Nodemon** - Auto-restart during development
- **ESLint** - Code linting (Airbnb config)
- **Prettier** - Code formatting

---

## Project Structure

```
se_project_express/
├── controllers/          # Request handlers (business logic)
│   ├── clothingItems.js  # Clothing item CRUD operations
│   └── users.js          # User authentication and profile management
├── errors/               # Custom error classes
│   ├── BadRequestError.js
│   ├── UnauthorizedError.js
│   ├── ForbiddenError.js
│   ├── NotFoundError.js
│   ├── ConflictError.js
│   └── index.js          # Exports all error classes
├── middlewares/          # Custom Express middleware
│   ├── auth.js           # JWT authentication middleware
│   ├── errorHandler.js   # Central error handling
│   ├── logger.js         # Winston request/error logging
│   └── validation.js     # Celebrate/Joi validation schemas
├── models/               # Mongoose data models
│   ├── clothingItem.js   # Clothing item schema
│   └── user.js           # User schema with authentication methods
├── routes/               # API route definitions
│   ├── clothingItems.js  # Clothing item routes
│   ├── users.js          # User routes
│   └── index.js          # Main router (combines all routes)
├── utils/                # Utility files
│   ├── config.js         # JWT secret configuration
│   └── errors.js         # HTTP status code constants
├── app.js                # Main application entry point
├── package.json          # Project dependencies and scripts
└── README.md             # This file
```

---

## Installation and Setup

### Prerequisites
- **Node.js** (v18.x or higher recommended)
- **npm** (comes with Node.js)
- **MongoDB** (v4.4 or higher)

### Step 1: Clone the Repository
```bash
git clone https://github.com/eliassalazargarcia/se_project_express.git
cd se_project_express
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start MongoDB
Make sure MongoDB is running on your machine:
```bash
# On macOS with Homebrew:
brew services start mongodb-community

# On Windows:
# Start MongoDB service from Services panel

# On Linux:
sudo systemctl start mongod
```

### Step 4: Start the Server

**Development mode** (with auto-restart):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:3001`

---

## API Endpoints

### Public Routes (No Authentication Required)

#### Authentication
- `POST /signup` - Create a new user account
- `POST /signin` - Login and receive JWT token
- `GET /items` - Get all clothing items

### Protected Routes (Authentication Required)

#### User Profile
- `GET /users/me` - Get current user's profile
- `PATCH /users/me` - Update current user's profile (name, avatar)

#### Clothing Items
- `POST /items` - Create a new clothing item
- `DELETE /items/:itemId` - Delete an item (only owner can delete)
- `PUT /items/:itemId/likes` - Like an item
- `DELETE /items/:itemId/likes` - Unlike an item

---

## Authentication Flow

### 1. Signup (Create Account)
```http
POST /signup
Content-Type: application/json

{
  "name": "John Doe",
  "avatar": "https://example.com/avatar.jpg",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response**: User object (password excluded) with 201 status

### 2. Signin (Login)
```http
POST /signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response**: JWT token (valid for 7 days)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Using Protected Routes
For all protected routes, include the JWT token in the Authorization header:

```http
GET /users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Example API Requests

### Create a Clothing Item
```http
POST /items
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Winter Jacket",
  "weather": "cold",
  "imageUrl": "https://example.com/jacket.jpg"
}
```

### Like an Item
```http
PUT /items/507f1f77bcf86cd799439011/likes
Authorization: Bearer YOUR_JWT_TOKEN
```

### Update Profile
```http
PATCH /users/me
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Jane Doe",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

---

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created (new resource)
- `400` - Bad Request (invalid data)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (no permission for this action)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate email)
- `500` - Internal Server Error

---

## Security Features

1. **Password Hashing**: Passwords are hashed with bcrypt before storage
2. **JWT Authentication**: Secure token-based authentication (7-day expiration)
3. **Password Hiding**: Password hashes are never returned in API responses
4. **Ownership Validation**: Users can only delete their own items
5. **Input Validation**: Request validation using Celebrate and Joi
6. **CORS Enabled**: Configured for secure cross-origin requests

---

## Logging

All requests are logged to `request.log` and all errors are logged to `error.log` using Winston.

Note: Log files are excluded from git via .gitignore

---

## Deployment

This project is deployed on a Google Cloud VM with:
- PM2 process manager for automatic recovery
- Nginx reverse proxy
- SSL certificate via Let's Encrypt

### Environment Variables (Production)
- `JWT_SECRET` - Strong secret key for JWT signing
- `NODE_ENV` - Set to 'production'

---

## Author

**Elias Salazar Garcia**

- GitHub: [@eliassalazargarcia](https://github.com/eliassalazargarcia)
- Backend Repository: [se_project_express](https://github.com/eliassalazargarcia/se_project_express)
- Frontend Repository: [se_project_react](https://github.com/eliassalazargarcia/se_project_react)

---

## License

This project is licensed under the ISC License.

---

## Acknowledgments

- **TripleTen** - Software Engineering Bootcamp
- **Project Sprint**: 15 - Deployment and Advanced Middleware
- Built as part of the WTWR (What To Wear?) full-stack application project

---

### Testing
Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 15
