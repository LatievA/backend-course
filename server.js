const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data.json");

// Middleware
app.use(express.json());

// Helper functions
const readData = () => {
  const data = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

const generateId = () => Math.floor(Date.now() / 1000);

// Demo Routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/hello", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/time", (req, res) => {
  res.json({ time: new Date().toISOString() });
});

app.get("/status", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// CRUD Routes for Tasks
// Get all tasks
app.get("/tasks", (req, res) => {
  const data = readData();
  res.json(data.tasks);
});

// Create new task
app.post("/tasks", (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ error: "Name field is required" });
  }

  const data = readData();
  const newTask = {
    id: generateId(),
    name,
    description: description || "",
    completed: false,
    createdAt: new Date().toISOString(),
  };

  data.tasks.push(newTask);
  writeData(data);

  res.status(201).json(newTask);
});

// Update task
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, completed } = req.body;
  const data = readData();

  const task = data.tasks.find((t) => t.id === parseInt(id));

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (name) task.name = name;
  if (description !== undefined) task.description = description;
  if (completed !== undefined) task.completed = completed;

  writeData(data);
  res.json(task);
});

// Delete task
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();

  const index = data.tasks.findIndex((t) => t.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  data.tasks.splice(index, 1);
  writeData(data);

  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});