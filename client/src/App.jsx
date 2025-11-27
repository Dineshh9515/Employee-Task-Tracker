import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Tasks from './pages/Tasks';
import MyTasks from './pages/MyTasks';
import PendingApproval from './pages/PendingApproval';
import CompleteProfile from './pages/CompleteProfile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/employees" element={<Employees />} />
              <Route path="/tasks" element={<Tasks />} />
            </Route>

            {/* User Routes */}
            <Route element={<ProtectedRoute allowedRoles={['user']} />}>
              <Route path="/my-tasks" element={<MyTasks />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
