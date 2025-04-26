// src/pages/NewTripPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseLayout from './BaseLayout';

const NewTripPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    start_date: '',
    end_date: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };
  const userId = localStorage.getItem('userId');
  const data = {
    title: formData['title'],
    start_date: formData['start_date'],
    end_date: formData['end_date'],
    user_id: userId,

  }



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips/create-trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // credentials: 'include', // for session cookies if using Flask-Login
        body: JSON.stringify(data)
      });

      if (res.ok) {
        navigate('/itinerary');
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to create trip');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting form');
    }
  };

  return (
    <BaseLayout>
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">Create New Trip</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Trip Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Summer Europe Adventure"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="start_date" className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="end_date" className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">Create Trip</button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/itinerary')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </BaseLayout>
  );
};

export default NewTripPage;
