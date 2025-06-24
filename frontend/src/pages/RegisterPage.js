import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api";

const RegisterPage = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await register(form);
      alert("Registered! Please log in.");
      navigate("/login");
    } catch (error) {
      alert(error.message || "Registration failed");
      console.error("Registration error details:", error);
    }
  };

  return (
    <div className="container">
      <h2>📝 Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" required onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default RegisterPage;
