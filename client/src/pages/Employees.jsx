import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [pendingEmployees, setPendingEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'pending'
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    roleTitle: '',
  });

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPendingEmployees = async () => {
    try {
      const res = await api.get('/employees/pending');
      setPendingEmployees(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchEmployees(), fetchPendingEmployees()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (error) {
        alert('Failed to delete employee');
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/employees/${id}/approve`);
      fetchAll();
    } catch (error) {
      alert('Failed to approve employee');
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Reject this employee request?')) {
      try {
        await api.post(`/employees/${id}/reject`);
        fetchAll();
      } catch (error) {
        alert('Failed to reject employee');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/employees', formData);
      setShowForm(false);
      setFormData({ name: '', email: '', department: '', roleTitle: '' });
      fetchEmployees();
    } catch (error) {
      alert('Failed to create employee');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Employees</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Employee'}
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button 
          className={`btn ${activeTab === 'active' ? 'btn-primary' : ''}`} 
          style={{ marginRight: '0.5rem', backgroundColor: activeTab === 'active' ? '#3498db' : '#ddd' }}
          onClick={() => setActiveTab('active')}
        >
          Active Employees
        </button>
        <button 
          className={`btn ${activeTab === 'pending' ? 'btn-primary' : ''}`}
          style={{ backgroundColor: activeTab === 'pending' ? '#f39c12' : '#ddd', color: activeTab === 'pending' ? 'white' : 'black' }}
          onClick={() => setActiveTab('pending')}
        >
          Pending Requests ({pendingEmployees.length})
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3>Add New Employee</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Role Title</label>
              <input
                type="text"
                value={formData.roleTitle}
                onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        </div>
      )}

      {activeTab === 'active' ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Role</th>
              <th>Tasks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>{emp.roleTitle}</td>
                <td>{emp.taskCount}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(emp._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Details</th>
              <th>Tasks/Actions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingEmployees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>
                  <strong>ID:</strong> {emp.empId}<br/>
                  <strong>Dept:</strong> {emp.department}<br/>
                  <strong>Role:</strong> {emp.roleTitle}
                </td>
                <td>
                  <small><strong>Tasks:</strong> {emp.tasksInfo}</small><br/>
                  <small><strong>Actions:</strong> {emp.actionsInfo}</small>
                </td>
                <td>
                  <button 
                    className="btn btn-sm"
                    style={{ backgroundColor: '#2ecc71', color: 'white', marginRight: '0.5rem' }}
                    onClick={() => handleApprove(emp._id)}
                  >
                    Approve
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleReject(emp._id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {pendingEmployees.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No pending requests</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Employees;
