import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import axios from 'axios';
import './HomePage.css';

const HomePage = ({ isAuthenticated, onLogout }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); 

  const handlePasswordReset = async () => {
    try {
      const token = localStorage.getItem('access_token'); 
      if (!token) {
        setError('You must be logged in to request a password reset.');
        return;
      }

      const response = await axios.post(
        'http://localhost:3000/auth/request-password-reset', 
        {}, 
        { 
          headers: { Authorization: `Bearer ${token}` } 
        }
      );
      setMessage('Password reset link has been sent to your email.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setMessage('');
    }
  };

  
  const isActiveLink = (path) => location.pathname === path;

  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="logo">
          <button onClick={() => navigate('/')}>
            <img src="/logo.png" alt="Logo" />
          </button>
        </div>
        <div className="navbar-links">
          {isAuthenticated && (
            <>
              <button 
                onClick={() => navigate('/material-resources')}
                className={isActiveLink('/material-resources') ? 'active' : ''}
              >
                View Resources
              </button>
              <button 
                onClick={() => navigate('/material-resources/create')}
                className={isActiveLink('/material-resources/create') ? 'active' : ''}
              >
                Create Resource
              </button>
              <button 
                onClick={() => navigate('/admin/register-admin')}
                className={isActiveLink('/admin/register-admin') ? 'active' : ''}
              >
                Register Admin
              </button>
              <button onClick={handlePasswordReset}>Request Password Reset</button>
            </>
          )}
        </div>
        {isAuthenticated && (
          <div className="logout-container">
            <button onClick={onLogout}>Logout</button>
          </div>
        )}
      </nav>
      <div className="content">
        <h1>Warehouse System</h1>
        {isAuthenticated ? (
          <div>
            <h3>Welcome to the Home Page!</h3>
          </div>
        ) : (
          <div>
            <h2>Please log in to continue</h2>
            <button onClick={() => navigate('/login')}>Login</button>
          </div>
        )}
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default HomePage;
