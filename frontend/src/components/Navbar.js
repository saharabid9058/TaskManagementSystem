import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ token, setToken }) => {
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <nav>
      <div className="navbar">
        <Link to="/">Home</Link>
        {token ? (
          <>
            <Link to="/add">Add Task</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
      
    </nav>
  );
};

export default Navbar;
