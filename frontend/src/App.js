import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './components/Login';
import ResourcePage from './pages/ResourcePage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import EditResourcePage from './pages/EditResourcePage'; 
import CreateResourcePage from './pages/CreateResourcePage'; 

const PrivateRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (token) => {
    setIsAuthenticated(true);
    localStorage.setItem('access_token', token);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('access_token');
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} onLogout={handleLogout} />} />
        <Route path="/material-resources" element={<PrivateRoute element={<ResourcePage isAuthenticated={isAuthenticated} />} isAuthenticated={isAuthenticated} />} />
        <Route path="/material-resources/create" element={<PrivateRoute element={<CreateResourcePage isAuthenticated={isAuthenticated} />} isAuthenticated={isAuthenticated} />} />
        <Route path="/material-resources/edit/:id" element={<PrivateRoute element={<EditResourcePage />} isAuthenticated={isAuthenticated} />} />
        <Route path="/admin/register-admin" element={<AdminRegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
