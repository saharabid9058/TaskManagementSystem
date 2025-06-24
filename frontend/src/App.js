import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import AddTaskPage from "./pages/AddTaskPage";
import EditTaskPage from "./pages/EditTaskPage";
import DeleteTaskPage from "./pages/DeleteTaskPage";


const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // On load, no token set, always show login first
    // Token will be set only after login.
    // You can optionally check localStorage here if needed
  }, []);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  return (
    <Router>
      <Routes>
        {/* If token not present, always redirect to login */}
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route
          path="/"
          element={token ? <HomePage token={token} setToken={setToken} /> : <Navigate to="/login" />}
        />
        <Route
          path="/add"
          element={token ? <AddTaskPage token={token} /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit/:id"
          element={token ? <EditTaskPage token={token} /> : <Navigate to="/login" />}
        />
         <Route
  path="/delete/:id"
  element={<DeleteTaskPage token={token} setToken={setToken} />}
/>
        {/* Redirect any unknown routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
