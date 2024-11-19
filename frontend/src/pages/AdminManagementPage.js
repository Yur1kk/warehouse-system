import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminManagementPage.css';

const AdminManagementPage = () => {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('You must be logged in to view admins.');
          return;
        }

        const response = await axios.get('http://localhost:3000/admin/all-admins', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdmins(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching admins.');
      }
    };

    fetchAdmins();
  }, []);

  const handleDeleteAdmin = async (adminId) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('You must be logged in to delete an admin.');
        return;
      }

      await axios.delete(`http://localhost:3000/admin/delete-admin/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAdmins(admins.filter((admin) => admin.id !== adminId));  
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting the admin.');
    }
  };

  return (
    <div className="admin-management-page">
      <nav className="navbar">
        <div className="navbar-links">
          <button onClick={() => navigate('/')}>
            Home
          </button>
          <h1></h1>
        </div>
      </nav>
<h1></h1>
<h2></h2>
<h3></h3>
      <div className="content">
        <h1>List of admins</h1>
        {error && <p className="error">{error}</p>}
        <ul>
          {admins.map((admin) => (
            <li key={admin.id}>
              {admin.name} - {admin.email}
              <button className='delete-button' onClick={() => handleDeleteAdmin(admin.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminManagementPage;
