import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import WorkloadHeatmap from '../components/WorkloadHeatmap';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/dashboard/summary');
        setSummary(res.data);
      } catch (error) {
        console.error('Error fetching dashboard summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!summary) return <div>Error loading dashboard data.</div>;

  // Find current user's workload if they are a regular user
  const myWorkload = user.role === 'user' && user.linkedEmployee 
    ? summary.workloadData.find(w => w._id === user.linkedEmployee) 
    : null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        {user.lastLoginAt && (
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            Last login: {format(new Date(user.lastLoginAt), 'MMM dd, yyyy HH:mm')}
          </div>
        )}
      </div>
      
      {user.role === 'admin' && summary.userStats && (
        <div className="card" style={{ borderLeft: '5px solid #8e44ad', marginBottom: '1rem' }}>
          <h3>User Overview</h3>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div>
              <strong>Total Users:</strong> {summary.userStats.totalUsers}
            </div>
            <div>
              <strong>Admins:</strong> {summary.userStats.adminCount}
            </div>
            <div>
              <strong>Regular Users:</strong> {summary.userStats.userCount}
            </div>
          </div>
        </div>
      )}

      {user.role === 'user' && myWorkload && (
        <div className="card" style={{ borderLeft: '5px solid #3498db' }}>
          <h3>Welcome back, {user.name}!</h3>
          <p>
            You have <strong>{myWorkload.openTasks}</strong> open tasks. 
            {myWorkload.overdueTasks > 0 && (
              <span style={{ color: 'red', marginLeft: '5px' }}>
                You have {myWorkload.overdueTasks} tasks overdue. Consider focusing on HIGH priority items first.
              </span>
            )}
          </p>
          <p>Your current workload level is: <strong>{myWorkload.workloadLevel}</strong></p>
        </div>
      )}

      <div className="grid-4">
        <div className="card">
          <h3>Total Tasks</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{summary.totalTasks}</p>
        </div>
        <div className="card">
          <h3>Completed</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2ecc71' }}>{summary.completedTasks}</p>
        </div>
        <div className="card">
          <h3>Completion Rate</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{summary.completionRate}%</p>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <WorkloadHeatmap data={summary.workloadData} />
      </div>
    </div>
  );
};

export default Dashboard;
