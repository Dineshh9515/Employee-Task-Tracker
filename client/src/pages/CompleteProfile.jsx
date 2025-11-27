import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CompleteProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    empId: '',
    department: '',
    roleTitle: '',
    tasksInfo: '',
    actionsInfo: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/employees/complete-profile', formData);
      navigate('/pending-approval');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit profile');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Complete Your Employee Profile</h2>
      <p style={{ marginBottom: '1.5rem', color: '#666' }}>
        Please provide your employee details to request access to the system.
      </p>
      
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
            disabled // Name usually comes from OAuth
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', backgroundColor: '#f9f9f9' }}
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
            disabled // Email usually comes from OAuth
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', backgroundColor: '#f9f9f9' }}
          />
        </div>
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

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Profile</button>
          <button type="button" onClick={logout} className="btn btn-danger" style={{ flex: 0.3 }}>Logout</button>
        </div>
      </form>
    </div>
  );
};

export default CompleteProfile;
