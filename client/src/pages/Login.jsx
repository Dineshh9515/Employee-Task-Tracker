import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const errorParam = params.get('error');

    if (token) {
      loginWithToken(token).then((result) => {
        if (result.success) {
          navigate('/dashboard');
        } else {
          setError('Authentication failed');
        }
      });
    } else if (errorParam) {
      setError('OAuth login failed');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password, role);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-container">
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>
        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '35%',
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
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Login
          </button>
        </form>

        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <a href={`${import.meta.env.VITE_API_BASE_URL}/auth/github`} className="btn" style={{ backgroundColor: '#333', color: 'white', textAlign: 'center', textDecoration: 'none' }}>
            Login with GitHub
          </a>
          <a href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`} className="btn" style={{ backgroundColor: '#db4437', color: 'white', textAlign: 'center', textDecoration: 'none' }}>
            Login with Google
          </a>
        </div>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
