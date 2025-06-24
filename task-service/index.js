const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Task = require('./models/Task');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Bearer token missing' });
    }

    console.log('Verifying token with secret:', process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Full JWT Verification Error:', {
      error: error.message,
      receivedToken: req.headers.authorization,
      envSecret: process.env.JWT_SECRET,
      stack: error.stack
    });
    res.status(401).json({ 
      message: 'Authentication failed',
      error: error.message
    });
  }
};

app.post('/api/tasks', verifyToken, async (req, res) => {
  try {
    const { title, dueDate, description, checklist } = req.body;
    
    const newTask = new Task({ 
      title, 
      dueDate, 
      description, 
      checklist: checklist || [], 
      userId: req.userId 
    });
    
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
});

app.get('/api/tasks/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/tasks', verifyToken, async (req, res) => {
  try {
   
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/tasks/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { title, dueDate, description, checklist } = req.body;
    if (title !== undefined) task.title = title;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (description !== undefined) task.description = description;
    if (checklist !== undefined) task.checklist = checklist;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.put('/api/tasks/:id/checklist', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.checklist = req.body.checklist;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/tasks/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5001;
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => console.log(`🚀 Task service running on port ${PORT}`));
}).catch(err => console.error('❌ MongoDB error:', err));
