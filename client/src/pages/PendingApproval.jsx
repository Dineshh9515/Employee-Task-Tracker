import React from 'react';
import { useAuth } from '../context/AuthContext';

const PendingApproval = () => {
  const { logout } = useAuth();

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div className="card" style={{ maxWidth: '500px' }}>
        <h1 style={{ color: '#f39c12' }}>Pending Approval</h1>
        <p style={{ fontSize: '1.2rem', margin: '1.5rem 0' }}>
          Your account has been created successfully but is currently awaiting administrator approval.
        </p>
        <p>
          You will not be able to access the dashboard or tasks until an admin reviews and approves your employee profile.
        </p>
        <div style={{ marginTop: '2rem' }}>
          <button onClick={logout} className="btn btn-primary">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
