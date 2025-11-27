import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { format } from 'date-fns';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks/my');
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/tasks/${id}`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div>
      <h1>My Tasks</h1>
      
      {tasks.length === 0 ? (
        <p>No tasks assigned to you.</p>
      ) : (
        <div className="grid-4">
          {tasks.map((task) => (
            <div key={task._id} className="card" style={{ borderTop: `4px solid ${task.priority === 'HIGH' ? '#e74c3c' : '#3498db'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                <span className={`badge badge-${task.status}`}>{task.status}</span>
              </div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
              </p>
              
              <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Update Status:</label>
                <select 
                  value={task.status} 
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  style={{ width: '100%', padding: '0.5rem' }}
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
