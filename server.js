// server.js
const express = require("express");
const path = require("node:path");
const { isValidName } = require("./utils/validate");
const helmet = require("helmet"); //fix with helmet

const app = express();
app.use(express.json());
app.use(helmet());   // use helmet for security headers

// serve static pages from /public
app.use(express.static(path.join(__dirname, "public")));

// in-memory "database"
const tasks = [];

// API: get tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// API: add task
app.post("/api/tasks", (req, res) => {
  const { name } = req.body || {};
  if (!isValidName(name)) {
    return res.status(400).json({ error: "Task name cannot be blank" });
  }
  const task = { id: tasks.length + 1, name: name.trim() };
  tasks.push(task);
  res.json(task);
});

// export app & helpers for tests
function resetTasks() {
  tasks.length = 0; // empty the array
}
module.exports = { app, _state: { resetTasks, tasks } };

// start server only when run directly (not when imported by tests)
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running: http://localhost:${port}`));
}
