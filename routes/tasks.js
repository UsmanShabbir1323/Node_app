// routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const cache = require('../cache');

// Create a new task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    await cache.del('all_tasks');
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/msg', async (req, res) => {
    res.status(200).send("Hello node world from node container. :)");
});

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const cacheKey = 'all_tasks';

    const cachedTasks = await cache.get(cacheKey);
    if (cachedTasks) {
      console.log('✅ Cache hit for all tasks');
      return res.json({ fromcache: true, data: JSON.parse(cachedTasks) });
    }

    console.log('❌ Cache miss for all tasks');
    const tasks = await Task.find();
    await cache.set(cacheKey, JSON.stringify(tasks));
    res.json({ fromcache: false, data: tasks });
  } catch (err) {
    console.error('❌ Error fetching tasks:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// Get a task by ID
router.get('/:id', async (req, res) => {
  const taskid = req.params.id;
  try {
    const cachedtask = await cache.get(taskid);
    if (cachedtask) {
      console.log(`✅ Cache hit for task ID: ${taskid}`);
      return res.json({ fromcache: true, data: JSON.parse(cachedtask) });
    }

    console.log(`❌ Cache miss for task ID: ${taskid}`);
    const task = await Task.findById(taskid);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await cache.set(taskid, JSON.stringify(task));
    return res.json({ fromcache: false, data: task });
  } catch (err) {
    console.error(`❌ Error fetching task ${taskid}:`, err.message);
    return res.status(500).json({ error: err.message });
  }
});


// Update a task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await cache.del('all_tasks');
    await cache.del(req.params.id);
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ error: 'Task not found' });
    await cache.del('all_tasks');
    await cache.del(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;