const API_URL_AUTH = 'http://localhost:5002/api/auth';
const API_URL_TASKS = 'http://localhost:5002/api/tasks';

// Register a new user
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL_AUTH}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error; // Re-throw to handle in component
  }
};

// Login a user
export const login = async (userData) => {
  const response = await fetch(`${API_URL_AUTH}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // No Authorization header here — token not available yet
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};

// Fetch all tasks
export const fetchTasks = async (token) => {
  const response = await fetch(API_URL_TASKS, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// Create a new task
export const createTask = async (taskData, token) => {
  const response = await fetch(API_URL_TASKS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });
  return response.json();
};

// Fetch a single task by ID
export const getTask = async (id, token) => {
  const response = await fetch(`${API_URL_TASKS}/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// Update an existing task
export const updateTask = async (id, taskData, token) => {
  const response = await fetch(`${API_URL_TASKS}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });
  return response.json();
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const token = localStorage.getItem('token'); // or wherever your token is stored
    const response = await fetch(`http://localhost:5002/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete task');
    }

    const data = await response.json();
    console.log('Deleted task:', data);
  } catch (error) {
    console.error('Delete task failed:', error.message);
  }
};
