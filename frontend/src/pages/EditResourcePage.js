import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './CreateResourcePage.css';

const EditResourcePage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [resource, setResource] = useState(null); 
  const [typesAndStatuses, setTypesAndStatuses] = useState({ types: [], statuses: [] });
  const [formData, setFormData] = useState({
    type: '',
    typeDescription: '',
    quantity: '',
    status: '',
    location: '',
    responsiblePerson: '',
    expectedArrivalDate: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login'); 
    } else {
      fetchTypesAndStatuses(token);
      fetchResource(token, id);
    }
  }, [id, navigate]);


  const fetchResource = async (token, id) => {
    try {
      const response = await axios.get(`http://localhost:3000/material-resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResource(response.data);
      setFormData({
        type: response.data.type,
        typeDescription: response.data.typeDescription,
        quantity: response.data.quantity,
        status: response.data.status,
        location: response.data.location,
        responsiblePerson: response.data.responsiblePerson,
        expectedArrivalDate: response.data.expectedArrivalDate || '',
      });
    } catch (error) {
      console.error('Error fetching resource:', error);
    }
  };


  const fetchTypesAndStatuses = async (token) => {
    try {
      const response = await axios.get('http://localhost:3000/material-resources/types-status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTypesAndStatuses(response.data);
    } catch (err) {
      console.error('Failed to load types and statuses:', err);
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('You must be logged in to update a resource.');
      return;
    }

    try {
      await axios.patch(
        `http://localhost:3000/material-resources/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Resource updated successfully');
      navigate('/material-resources'); 
    } catch (error) {
      console.error('Error updating resource:', error);
      alert('Failed to update resource. Please try again.');
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="create-resource-page">
      {/* Navbar */}
      <nav className="navbar">
        <ul>
          <button onClick={() => navigate('/')}>Home</button>
        </ul>
      </nav>

      <h1>Edit Resource</h1>

      {resource && (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="type">Resource Type:</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Type</option>
              {typesAndStatuses.types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="typeDescription">Type Description:</label>
            <input
              type="text"
              id="typeDescription"
              name="typeDescription"
              value={formData.typeDescription}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="status">Resource Status:</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Status</option>
              {typesAndStatuses.statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="responsiblePerson">Responsible Person:</label>
            <input
              type="text"
              id="responsiblePerson"
              name="responsiblePerson"
              value={formData.responsiblePerson}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="expectedArrivalDate">Expected Arrival Date:</label>
            <input
              type="date"
              id="expectedArrivalDate"
              name="expectedArrivalDate"
              value={formData.expectedArrivalDate}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit">Update Resource</button>
        </form>
      )}
    </div>
  );
};

export default EditResourcePage;
