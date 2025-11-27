import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar">
        <div className="brand">TaskTracker</div>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          
          {user?.role === 'admin' && (
            <>
              <Link to="/employees">Employees</Link>
              <Link to="/tasks">All Tasks</Link>
            </>
          )}
          
          {user?.role === 'user' && (
            <Link to="/my-tasks">My Tasks</Link>
          )}

          <div style={{ marginLeft: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>{user?.name} ({user?.role})</span>
            <button onClick={handleLogout} className="btn btn-sm btn-danger">Logout</button>
          </div>
        </div>
      </nav>
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
