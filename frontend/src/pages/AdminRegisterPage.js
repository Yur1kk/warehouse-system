import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminRegister.css';

const RegisterAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [role, setRole] = useState(2); 
  const [name, setUserName] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token'); 

      const response = await axios.post(
        'http://localhost:3000/admin/register-admin',
        {
          email,
          password,
          confirmPassword,
          adminPassword,
          roleId: role, 
          name, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      if (response.status === 201) {
        alert('Admin registered successfully!');
        navigate('/'); 
      } else {
        alert('Error during registration');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred during registration');
    }
  };

  return (
    <div className="register-admin-page">
      <nav className="navbar">
        <button onClick={() => navigate('/')}>Home</button>
      </nav>

      <form onSubmit={handleSubmit} className="form-container">
      <h2>Register New Admin</h2>
        <input
          type="text"
          placeholder="User Name"
          value={name}
          onChange={(e) => setUserName(e.target.value)} 
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Admin Password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          required
        />

        <select value={role} onChange={(e) => setRole(Number(e.target.value))}>
          <option value={2}>Warehouse Admin</option>
          <option value={3}>Personal Records Admin</option>
          <option value={4}>Documentation Admin</option>
        </select>

        <button type="submit">Register Admin</button>
      </form>
    </div>
  );
};

export default RegisterAdmin;
