import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ResourcePage.css';

const ResourcePage = ({ isAuthenticated }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 
  const navigate = useNavigate();

  const statusTranslations = {
    ON_REPAIR: 'На ремонті',
    DESTROYED: 'Знищено',
    DEPLOYED: 'Використовується',
    IN_STOCK: 'В наявності',
    EXPECTED: 'Очікується',
  };

  const typeTranslations = {
    TECHNIQUE: 'Техніка',
    WEAPON: 'Зброя',
    AMMUNITION: 'Боєприпаси',
    ARTILLERY: 'Артилерія',
    AUTOTRANSPORT: 'Автотранспорт',
  };

  const statusOptions = ['ON_REPAIR', 'DESTROYED', 'DEPLOYED', 'IN_STOCK', 'EXPECTED'];
  const typeOptions = ['TECHNIQUE', 'WEAPON', 'AMMUNITION', 'ARTILLERY', 'AUTOTRANSPORT'];

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('access_token');
      if (token) {
        fetchResources(token, currentPage);
      }
    }
  }, [isAuthenticated, statusFilter, typeFilter, currentPage]);

  const fetchResources = async (token, page) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/material-resources', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          status: statusFilter,
          type: typeFilter,
          page: page, 
          limit: itemsPerPage, 
        },
      });
      setResources(response.data.items);
      setTotalPages(response.data.totalPages); 
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="resource-page">
      <nav className="navbar">
        <button onClick={() => navigate('/')}>Home</button>
      </nav>

<h2></h2>
      <div className="filters">
      <h2>Resources</h2>
  <div>
    <label>Status:</label>
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="">All</option>
      {statusOptions.map((status) => (
        <option key={status} value={status}>
          {statusTranslations[status]}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label>Type:</label>
    <select
      value={typeFilter}
      onChange={(e) => setTypeFilter(e.target.value)}
    >
      <option value="">All</option>
      {typeOptions.map((type) => (
        <option key={type} value={type}>
          {typeTranslations[type]}
        </option>
      ))}
    </select>
  </div>
</div>


      {loading ? <p>Loading...</p> : null}

      {resources.length === 0 ? (
        <p>No resources available</p>
      ) : (
        <ul>
          {resources.map((resource) => (
            <li key={resource.id}>
              <h3>{resource.type}</h3>
              <p>Status: {statusTranslations[resource.status]}</p>
              <p>Quantity: {resource.quantity}</p>
              <button onClick={() => handleViewDetails(resource)}>View Details</button>
              <button onClick={() => handleEdit(resource.id)}>Edit</button>
              <button onClick={() => handleDelete(resource.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {selectedResource && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Resource Details</h3>
            <p><strong>Type:</strong> {typeTranslations[selectedResource.type]}</p>
            <p><strong>Status:</strong> {statusTranslations[selectedResource.status]}</p>
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
