const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const jwt = require('jsonwebtoken');



const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.options('*', cors());

// === AUTH ROUTES ===
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Received registration request:', req.body);
    const response = await axios.post('http://localhost:5003/api/auth/register', req.body, {
      headers: { 'Content-Type': 'application/json' }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Full error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5003/api/auth/login', req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Full error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Internal server error';
    res.status(status).json({ message });
  }
});

// === TASK ROUTES ===
app.get('/api/tasks', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5001/api/tasks', {
      headers: {
        Authorization: req.headers['authorization'],
        'Content-Type': 'application/json'
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Internal server error',
      details: error.response?.data
    });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.title || !req.body.dueDate) {
      return res.status(400).json({ message: 'Title and dueDate are required' });
    }

    // Verify we have an authorization header
    if (!req.headers['authorization']) {
      return res.status(401).json({ message: 'Authorization header required' });
    }

    // Forward to task service
    const response = await axios.post('http://localhost:5001/api/tasks', req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers['authorization'] // Forward exact header
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('API Gateway Task Creation Error:', {
      message: error.message,
      responseData: error.response?.data,
      requestHeaders: error.config?.headers,
      stack: error.stack
    });
    
    const status = error.response?.status || 500;
    res.status(status).json({
      message: 'Task creation failed',
      details: error.response?.data || error.message
    });
  }
});
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const response = await axios.put(`http://localhost:5001/api/tasks/${req.params.id}`, req.body, {
      headers: {
        Authorization: req.headers['authorization'],
        'Content-Type': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Internal server error',
      details: error.response?.data,
    });
  }
});

app.get('/api/tasks/:id', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5001/api/tasks/${req.params.id}`, {
      headers: {
        Authorization: req.headers['authorization'],
        'Content-Type': 'application/json'
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Internal server error',
      details: error.response?.data
    });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const response = await axios.delete(`http://localhost:5001/api/tasks/${req.params.id}`, {
      headers: {
        Authorization: req.headers['authorization'],
        'Content-Type': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Internal server error',
      details: error.response?.data,
    });
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🚀 API Gateway running on port ${PORT}`));
