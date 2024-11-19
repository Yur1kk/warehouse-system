import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); 
    setError(''); 

    try {
      console.log('Submitting login request for email:', email);
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      const { access_token } = response.data;
      console.log('Received access_token:', access_token);

      if (response.status === 201 && access_token) {
        localStorage.setItem('access_token', access_token);
        onLoginSuccess(access_token);
        alert('Login successful!');
        navigate('/'); 
      } else {
        setError('Invalid credentials'); 
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Invalid password or email');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="login-page">
      <h1>Warehouse System</h1>
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading} 
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading} 
          />
        </div>
        {error && <p className="error-message">{error}</p>} 
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'} 
        </button>
      </form>
    </div>
  );
};

export default Login;
