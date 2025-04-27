// src/pages/FindTripsPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseLayout from './BaseLayout';
import { Link } from "react-router-dom";

const FindTripsPage = () => {
  const [ownedTrips, setOwnedTrips] = useState([]);
  const [publicTrips, setPublicTrips] = useState([]);
  const [searchParams, setSearchParams] = useState({
    title: '',
    country: '',
    from_date: '',
    to_date: ''
  });
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user_id: userId,
          ...searchParams 
        })
      });
      const data = await response.json();
      setOwnedTrips(data.owned_trips || []);
      setPublicTrips(data.public_trips || []);
    } catch (err) {
      console.error('Error searching trips:', err);
    }
  };

  const handleClear = () => {
    setSearchParams({
      title: '',
      country: '',
      from_date: '',
      to_date: ''
    });
    // Refetch all trips
    fetch('https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId })
    })
    .then(res => res.json())
    .then(data => {
      setOwnedTrips(data.owned_trips || []);
      setPublicTrips(data.public_trips || []);
    })
    .catch(err => console.error('Error fetching trips:', err));
  };

  useEffect(() => {
    // Initial fetch
    fetch('https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId })
    })
    .then(res => res.json())
    .then(data => {
      setOwnedTrips(data.owned_trips || []);
      setPublicTrips(data.public_trips || []);
    })
    .catch(err => console.error('Error fetching trips:', err));
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <BaseLayout>
      <div className="container mt-4">
        <h3>Not sure how to plan your trips?</h3>
        <p>Get inspired by like minded travellers</p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="row align-items-end">
            {/* Title Field */}
            <div className="col-md-3">
              <div className="form-group mb-2">
                <label htmlFor="title" className="form-label small">Title</label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  className="form-control" 
                  placeholder="Search by title"
                  value={searchParams.title}
                  onChange={(e) => setSearchParams({...searchParams, title: e.target.value})}
                />
              </div>
            </div>

            {/* Country Dropdown */}
            <div className="col-md-3">
              <div className="form-group mb-2">
                <label htmlFor="country" className="form-label small">Country</label>
                <select 
                  id="country" 
                  name="country" 
                  className="form-control"
                  value={searchParams.country}
                  onChange={(e) => setSearchParams({...searchParams, country: e.target.value})}
                >
                  <option value="">Select a Country</option>
                  <option value="United States">United States</option>
                  <option value="France">France</option>
                  <option value="Italy">Italy</option>
                  <option value="Japan">Japan</option>
                  <option value="Korea">South Korea</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Spain">Spain</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
            </div>

            {/* From Date */}
            <div className="col-md-2">
              <div className="form-group mb-2">
                <label htmlFor="from_date" className="form-label small">From</label>
                <input 
                  type="date" 
                  id="from_date" 
                  name="from_date" 
                  className="form-control"
                  value={searchParams.from_date}
                  onChange={(e) => setSearchParams({...searchParams, from_date: e.target.value})}
                />
              </div>
            </div>

            {/* To Date */}
            <div className="col-md-2">
              <div className="form-group mb-2">
                <label htmlFor="to_date" className="form-label small">To</label>
                <input 
                  type="date" 
                  id="to_date" 
                  name="to_date" 
                  className="form-control"
                  value={searchParams.to_date}
                  onChange={(e) => setSearchParams({...searchParams, to_date: e.target.value})}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="col-md-2">
              <div className="form-group mb-2 d-flex gap-2">
                <button type="submit" className="btn btn-primary w-100">Search</button>
                <button 
                  type="button" 
                  className="btn btn-secondary w-100"
                  onClick={handleClear}
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </form>

        {ownedTrips.length > 0 && (
          <>
            <h3>My Public Trips</h3>
            <div className="row">
              {ownedTrips.map(trip => (
                <div className="col-md-4 mb-4" key={trip['trip-id']}>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{trip.title}</h5>
                      <p className="card-text">
                        {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                      </p>
                      <Link
                        to={`/shared-trip/${trip['trip-id']}`}
                        className="btn btn-primary"
                      >
                        View Itinerary
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {publicTrips.length > 0 && (
          <>
            <h3>Find Other Trips</h3>
            <div className="row">
              {publicTrips.map(trip => (
                <div className="col-md-4 mb-4" key={trip.id}>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{trip.title}</h5>
                      <p className="card-text">
                        {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                      </p>
                      <p className="card-text">
                        <small className="text-muted">By {trip.user_id}</small>
                      </p>
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/public-trip/${trip['trip-id']}`)}
                      >
                        View Itinerary
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </BaseLayout>
  );
};

export default FindTripsPage;
