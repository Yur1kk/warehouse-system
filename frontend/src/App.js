import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './components/Login';
import ResourcePage from './pages/ResourcePage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import EditResourcePage from './pages/EditResourcePage';
import CreateResourcePage from './pages/CreateResourcePage';
import AdminManagementPage from './pages/AdminManagementPage'; 

const PrivateRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const AdminRoute = ({ element, isAuthenticated, userRole }) => {
  return isAuthenticated && userRole === 1 ? element : <Navigate to="/" />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      
      
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        // Token is expired
        localStorage.removeItem('access_token');  
        setIsAuthenticated(false);
        setUserRole(null);
      } else {
        setIsAuthenticated(true);
        setUserRole(decodedToken.roleId);
      }
    }
    setLoading(false);  
  }, []);

  const handleLoginSuccess = (token) => {
    setIsAuthenticated(true);
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    setUserRole(decodedToken.roleId);
    localStorage.setItem('access_token', token);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('access_token');
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} onLogout={handleLogout} userRole={userRole} />} />
        <Route path="/material-resources" element={<PrivateRoute element={<ResourcePage isAuthenticated={isAuthenticated} />} isAuthenticated={isAuthenticated} />} />
        <Route path="/material-resources/create" element={<PrivateRoute element={<CreateResourcePage isAuthenticated={isAuthenticated} />} isAuthenticated={isAuthenticated} />} />
        <Route path="/material-resources/edit/:id" element={<PrivateRoute element={<EditResourcePage />} isAuthenticated={isAuthenticated} />} />
        <Route path="/admin/register-admin" element={<AdminRegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/admin/manage-admins" element={<AdminRoute element={<AdminManagementPage />} isAuthenticated={isAuthenticated} userRole={userRole} />} />
        <Route path="*" element={isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
