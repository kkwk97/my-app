// src/pages/FindTripsPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseLayout from './BaseLayout';

import { Link } from "react-router-dom";

const FindTripsPage = () => {
  const [ownedTrips, setOwnedTrips] = useState([]);
  const [publicTrips, setPublicTrips] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  useEffect(() => {
    // Fetch trips from your Flask backend API
    // fetch('/api/trips')
    fetch('https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId })
    }).then(res => res.json())
      .then(data => {
        setOwnedTrips(data.owned_trips || []);
        setPublicTrips(data.public_trips || []);
      })
      .catch(err => console.error('Error fetching trips:', err));
  }, []);

  const handleCopyTrip = async (tripId) => {
    const confirmCopy = window.confirm('Are you sure you want to copy this trip into your own trips?');
    if (!confirmCopy) return;

    try {
      const data = {
        trip_id: tripId,
        username: userId,
        user_id: userId
      };

      const res = await fetch('https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips/copy-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        alert('Trip copied successfully!');
        // Optionally, you can navigate or refresh trips
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to copy trip.');
      }
    } catch (error) {
      console.error('Error copying trip:', error);
      alert('Something went wrong while copying trip.');
    }
  };

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
                      // onClick={() => navigate(`/trip/${trip['trip-id']}`)}
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
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/public-trip/${trip['trip-id']}`)}
                      >
                        View Itinerary
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleCopyTrip(trip['trip-id'])}
                      >
                        Copy Trip
                      </button>
                    </div>
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
