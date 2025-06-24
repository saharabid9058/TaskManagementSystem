import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

const LoginPage = ({ setToken }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await login(form);
    if (res.token) {
      localStorage.setItem("token", res.token);
      setToken(res.token);
      navigate("/");
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="container">
      <h2>🔐 Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="username" name="username" placeholder="Username" required onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default LoginPage;
