import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    empId: '',
    department: '',
    roleTitle: '',
    tasksInfo: '',
    actionsInfo: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'Weak';
    if (password.match(/[a-z]/) && password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) {
      return 'Strong';
    }
    return 'Medium';
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'password') {
      setPasswordStrength(checkPasswordStrength(e.target.value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.role === 'user' && res.data.isApproved === false) {
        navigate('/pending-approval');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 'Weak') return 'red';
    if (passwordStrength === 'Medium') return 'orange';
    if (passwordStrength === 'Strong') return 'green';
    return 'black';
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Register</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {passwordStrength && (
            <div style={{ fontSize: '0.8rem', marginBottom: '1rem', color: getStrengthColor() }}>
              Strength: {passwordStrength}
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {formData.role === 'user' && (
          <>
            <div className="form-group">
              <label>Employee ID</label>
              <input
                type="text"
                name="empId"
                value={formData.empId}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
              />
            </div>
            <div className="form-group">
              <label>Job Title / Role</label>
              <input
                type="text"
                name="roleTitle"
                value={formData.roleTitle}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
              />
            </div>
            <div className="form-group">
              <label>Tasks / Responsibilities</label>
              <textarea
                name="tasksInfo"
                value={formData.tasksInfo}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
              />
            </div>
            <div className="form-group">
              <label>Actions / Notes</label>
              <textarea
                name="actionsInfo"
                value={formData.actionsInfo}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
              />
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
