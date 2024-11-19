import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ResourcePage.css'; 

const ResourcePage = ({ isAuthenticated }) => {
  const [resources, setResources] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [types, setTypes] = useState([]); 
  const [statuses, setStatuses] = useState([]); 
  const [selectedResource, setSelectedResource] = useState(null); 
  const navigate = useNavigate(); 

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('access_token');
      if (token) {
        fetchTypesAndStatuses(token);
        fetchResources(token, filterType, filterStatus);
      }
    }
  }, [isAuthenticated, filterType, filterStatus]);


  const fetchTypesAndStatuses = async (token) => {
    try {
      const response = await axios.get('http://localhost:3000/material-resources/types-status', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTypes(response.data.types); 
      setStatuses(response.data.statuses); 
    } catch (error) {
      console.error('Error fetching types and statuses:', error);
    }
  };


  const fetchResources = async (token, type, status) => {
    try {
      let url = 'http://localhost:3000/material-resources/filter';
      const params = {};
      if (type) params.type = type;
      if (status) params.status = status;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params,
      });
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };


  const handleEdit = (id) => {
    navigate(`/material-resources/edit/${id}`);
  };


  const handleDelete = async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`http://localhost:3000/material-resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setResources(resources.filter((resource) => resource.id !== id));
      alert('Resource deleted successfully');
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };


  const handleViewDetails = (resource) => {
    setSelectedResource(resource);
  };


  const closeModal = () => {
    setSelectedResource(null);
  };

  return (
    <div className="resource-page">

      <nav className="navbar">
        <button onClick={() => navigate('/')}>Home</button>
      </nav>

      <h2></h2>
      <h2>Resources</h2>


      <div className="filters">
        <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
          <option value="">Filter by Type</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
          <option value="">Filter by Status</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>


      <div className="resource-summary">
        <p>Total Resources: {resources.length}</p>
      </div>


      {resources.length === 0 ? (
        <p>No resources available</p>
      ) : (
        <ul>
          {resources.map((resource) => (
            <li key={resource.id}>
              <h3>{resource.type}</h3>
              <p>Status: {resource.status}</p>
              <p>Quantity: {resource.quantity}</p>
              <button onClick={() => handleViewDetails(resource)}>View Details</button>
              <button onClick={() => handleEdit(resource.id)}>Edit</button>
              <button onClick={() => handleDelete(resource.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      {selectedResource && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Resource Details</h3>
            <p><strong>Type:</strong> {selectedResource.type}</p>
            <p><strong>Status:</strong> {selectedResource.status}</p>
            <p><strong>Type Description:</strong> {selectedResource.typeDescription}</p>
            <p><strong>Quantity:</strong> {selectedResource.quantity}</p>
            <p><strong>Location:</strong> {selectedResource.location}</p>
            <p><strong>Responsible Person:</strong> {selectedResource.responsiblePerson}</p>
            <p><strong>Expected Arrival Date:</strong> {selectedResource.expectedArrivalDate}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcePage;
