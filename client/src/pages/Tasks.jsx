import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { format } from 'date-fns';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
    assignedTo: '',
  });

  const fetchData = async () => {
    try {
      const [tasksRes, empsRes] = await Promise.all([
        api.get(`/tasks${filterStatus ? `?status=${filterStatus}` : ''}`),
        api.get('/employees')
      ]);
      setTasks(tasksRes.data);
      setEmployees(empsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterStatus]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchData();
      } catch (error) {
        alert('Failed to delete task');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', formData);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        priority: 'MEDIUM',
        dueDate: '',
        assignedTo: '',
      });
      fetchData();
    } catch (error) {
      alert('Failed to create task');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>All Tasks</h1>
        <div>
          <select 
            style={{ marginRight: '1rem', padding: '0.5rem' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Task'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card">
          <h3>Create New Task</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid-4">
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp._id}>{emp.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Create Task</button>
          </form>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>
                <strong>{task.title}</strong>
                <br />
                <small>{task.description}</small>
              </td>
              <td>{task.assignedTo?.name || 'Unassigned'}</td>
              <td><span className={`badge badge-${task.status}`}>{task.status}</span></td>
              <td><span className={`badge badge-${task.priority}`}>{task.priority}</span></td>
              <td>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</td>
              <td>
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tasks;
