// ─── controllers/taskController.js ───────────────────────────────────────────
// Task management — admin assigns tasks, accountants update them
// ─────────────────────────────────────────────────────────────────────────────

const asyncHandler = require("express-async-handler");
const Task = require("../models/Task");

// GET /api/tasks — accountant sees own tasks, admin sees all
const getTasks = asyncHandler(async (req, res) => {
  let query = {};
  if (req.user.role === "accountant") query.accountant = req.user._id;
  if (req.query.clientId)    query.client    = req.query.clientId;
  if (req.query.accountantId) query.accountant = req.query.accountantId;
  if (req.query.status)      query.status    = req.query.status;

  const tasks = await Task.find(query)
    .populate("client",     "name email")
    .populate("accountant", "name email")
    .sort({ deadline: 1 });

  res.json({ success: true, count: tasks.length, tasks });
});

// POST /api/tasks — admin creates a task and assigns it to an accountant
const createTask = asyncHandler(async (req, res) => {
  const { client, accountant, title, type, period, priority, deadline, description } = req.body;

  if (!client || !title || !type || !period || !deadline) {
    res.status(400);
    throw new Error("client, title, type, period and deadline are required");
  }

  const task = await Task.create({ client, accountant, title, type, period, priority, deadline, description });

  const populated = await Task.findById(task._id)
    .populate("client",     "name email")
    .populate("accountant", "name email");

  res.status(201).json({ success: true, message: "Task created and assigned", task: populated });
});

// PUT /api/tasks/:id — accountant updates status, admin updates anything
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) { res.status(404); throw new Error("Task not found"); }

  // Accountant can only change status of tasks assigned to them
  if (req.user.role === "accountant") {
    if (task.accountant?.toString() !== req.user._id.toString()) {
      res.status(403); throw new Error("Not authorized to update this task");
    }
    task.status = req.body.status || task.status;
  } else {
    // Admin can update all fields
    const fields = ["title", "type", "period", "priority", "status", "deadline", "description", "accountant"];
    fields.forEach((f) => { if (req.body[f] !== undefined) task[f] = req.body[f]; });
  }

  const updated = await task.save();
  res.json({ success: true, message: "Task updated", task: updated });
});

// DELETE /api/tasks/:id — admin only
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) { res.status(404); throw new Error("Task not found"); }
  await task.deleteOne();
  res.json({ success: true, message: "Task deleted" });
});

module.exports = { getTasks, createTask, updateTask, deleteTask };
