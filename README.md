# TaskFlow – Task Management System

TaskFlow is a modular, microservices-based task management application designed for organizing daily workflows, task tracking, and priority management.

## Architecture

The project is structured into independent services:

- **Auth API (`api/auth-api`)**: Authentication and user management microservice built with Node.js, Express, MongoDB (Mongoose), and JWT.
  - User registration & login
  - Password hashing with bcryptjs
  - JWT token generation & verification
  - Authentication middleware & cookies support
- **Task API (`api/task-api`)**: Task lifecycle and CRUD microservice built with Node.js, Express, and MongoDB.
  - Create, view, update, and delete tasks
  - Task prioritization, statuses, and due dates
  - User authorization checks via JWT
- **Client (`client`)**: Frontend user interface (in development).

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas or local MongoDB instance

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/TheBinaryNumberSystem/TaskFlow-Task_Management_System.git
   cd TaskFlow-Task_Management_System
   ```

2. **Setup Auth Service**:
   ```bash
   cd api/auth-api
   npm install
   cp .env.example .env
   # Update .env with your MongoDB URI and JWT secrets
   npm run dev
   ```
   Runs by default on `http://localhost:5001`.

3. **Setup Task Service**:
   ```bash
   cd api/task-api
   npm install
   cp .env.example .env
   # Update .env with your MongoDB URI and JWT secrets
   npm run dev
   ```
   Runs by default on `http://localhost:5002`.

## Environment Variables

Refer to `.env.example` in each service folder:
- `PORT`: Service port
- `NODE_ENV`: Application environment (`development` / `production`)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRES_IN`: JWT expiration time
- `CLIENT_URL`: Allowed frontend origin for CORS

## License

ISC

