import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateResourcePage.css';

const CreateResourcePage = ({ isAuthenticated }) => {
  const [type, setType] = useState('');
  const [typeDescription, setTypeDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState('');
  const [responsiblePerson, setResponsiblePerson] = useState('');
  const [expectedArrivalDate, setExpectedArrivalDate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [typesAndStatuses, setTypesAndStatuses] = useState({ types: [], statuses: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTypesAndStatuses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/material-resources/types-status', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setTypesAndStatuses(response.data);
      } catch (err) {
        setError('Failed to load types and statuses.');
      }
    };
    fetchTypesAndStatuses();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!type || !typeDescription || !quantity || !status || !location || !responsiblePerson) {
      setError('All fields are required!');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('You must be logged in to create a resource.');
        return;
      }

      const response = await axios.post(
        'http://localhost:3000/material-resources',
        {
          type,
          typeDescription,
          quantity: parseInt(quantity),
          status,
          location,
          responsiblePerson,
          expectedArrivalDate: expectedArrivalDate ? new Date(expectedArrivalDate) : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setMessage('Resource created successfully!');
      setError('');
      navigate('/material-resources');
    } catch (err) {
      setError('Failed to create resource. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="create-resource-page">

      <nav className="navbar">
        <ul>
        <button onClick={() => navigate('/')}>Home</button>
        </ul>
      </nav>

      <h1></h1>

      
      
      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
      <h1>Create New Resource</h1>
        <div>
          <label htmlFor="type">Resource Type:</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            {typesAndStatuses.types.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="typeDescription">Type Description:</label>
          <input
            type="text"
            id="typeDescription"
            value={typeDescription}
            onChange={(e) => setTypeDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="status">Resource Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Select Status</option>
            {typesAndStatuses.statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="responsiblePerson">Responsible Person:</label>
          <input
            type="text"
            id="responsiblePerson"
            value={responsiblePerson}
            onChange={(e) => setResponsiblePerson(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="expectedArrivalDate">Expected Arrival Date:</label>
          <input
            type="date"
            id="expectedArrivalDate"
            value={expectedArrivalDate}
            onChange={(e) => setExpectedArrivalDate(e.target.value)}
          />
        </div>

        <button type="submit">Create Resource</button>
      </form>
    </div>
  );
};

export default CreateResourcePage;
