# backend-course

## Assignment 1

### Project Description

This project implements a basic REST API for task management using Express.js 
and JSON file persistence. It supports full CRUD operations (Create, Read, 
Update, Delete).

### Installation

1. Clone the repository
2. Install dependencies:
   npm install

### Running the Server

Start the server:
   npm start

Server will run on `http://localhost:3000`

### API Routes

#### Demo Routes
- **GET** `/` - Returns "Server is running"
- **GET** `/hello` - Returns JSON greeting
- **GET** `/time` - Returns current server time
- **GET** `/status` - Returns 200 OK status

#### Task CRUD Routes
- **GET** `/tasks` - Get all tasks
- **POST** `/tasks` - Create new task
- **PUT** `/tasks/:id` - Update existing task
- **DELETE** `/tasks/:id` - Delete task

### Example cURL Requests

#### Demo Routes

```bash
# GET / - Server is running
curl http://localhost:3000/

# GET /hello - Hello message
curl http://localhost:3000/hello

# GET /time - Current server time
curl http://localhost:3000/time

# GET /status - Status OK
curl http://localhost:3000/status
```

#### Task CRUD Routes

```bash
# GET /tasks - Get all tasks
curl http://localhost:3000/tasks

# POST /tasks - Create new task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"name":"Buy groceries","description":"Milk, eggs, bread"}'

# POST /tasks - Another example
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"name":"Complete assignment"}'

# PUT /tasks/:id - Update task (replace 1702000000 with actual ID)
curl -X PUT http://localhost:3000/tasks/1702000000 \
  -H "Content-Type: application/json" \
  -d '{"name":"Buy groceries","completed":true}'

# DELETE /tasks/:id - Delete task
curl -X DELETE http://localhost:3000/tasks/1702000000
```