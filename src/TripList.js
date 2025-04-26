import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // To handle routing to trip detail page
import BaseLayout
from "./BaseLayout";
import { useNavigate } from 'react-router-dom';


 
function TripList() {
  const [ownedTrips, setOwnedTrips] = useState([]);
  const [sharedTrips, setSharedTrips] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  // // Fetch owned trips
  // useEffect(() => {
  //   const fetchOwnedTrips = async () => {
  //     try {
  //       const response = await fetch('https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips', {
  //         method: 'GET',
  //         body: {"user_id":userId}
  //       });
  //       if (response.ok) {
  //         const data = await response.json();
  //         setOwnedTrips(data);
  //       } else {
  //         console.error("Failed to fetch owned trips");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching owned trips:", error);
  //     }
  //   };

  //   fetchOwnedTrips();
  // }, []);


  // // Fetch shared trips
  // useEffect(() => {
  //   const fetchSharedTrips = async () => {
  //     try {
  //       const response = await fetch('https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips', {
  //         method: 'GET',
  //         body: {"user_id":userId}
  //       }); 
  //       if (response.ok) {
  //         const data = await response.json();
  //         setSharedTrips(data);
  //       } else {
  //         console.error("Failed to fetch shared trips");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching shared trips:", error);
  //     }
  //   };

  //   fetchSharedTrips();
  // }, []);

  useEffect(() => {
      // Fetch trips from your Flask backend API
      // fetch('/api/trips')
      fetch('https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips/mytrip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId })
      }).then(res => res.json())
        .then(data => {
          setOwnedTrips(data.owned_trips || []);
          setSharedTrips(data.shared_trips || []);
        })
        .catch(err => console.error('Error fetching trips:', err));
  }, []);


  return (
    <BaseLayout>
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Trips</h2>
        <Link to="/new-trip" className="btn btn-primary">
          <i className="fas fa-plus"></i> New Trip
        </Link>
      </div>

      {/* Owned Trips */}
      {ownedTrips.length > 0 && (
        <div>
          <h3>My Trips</h3>
          <div className="row">
            {ownedTrips.map((trip) => (
              <div className="col-md-4 mb-4" key={trip.id}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{trip.title}</h5>
                    <p className="card-text">
                      {new Date(trip.start_date).toLocaleDateString()} -{" "}
                      {new Date(trip.end_date).toLocaleDateString()}
                    </p>
                    <Link
                      to={`/trip/${trip['trip-id']}`}
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
        </div>
      )}

      {/* Shared Trips */}
      {sharedTrips.length > 0 && (
        <div>
          <h3>Shared With Me</h3>
          <div className="row">
            {sharedTrips.map((trip) => (
              <div className="col-md-4 mb-4" key={trip.id}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{trip.title}</h5>
                    <p className="card-text">
                      {new Date(trip.start_date).toLocaleDateString()} -{" "}
                      {new Date(trip.end_date).toLocaleDateString()}
                    </p>
                    <p className="card-text">
                      <small className="text-muted">
                        Shared by {trip.user_id}
                      </small>
                    </p>
                    <button
                      // to={`/trip/${trip['trip-id']}`}
                      className="btn btn-primary"
                      onClick={() => navigate(`/trip/${trip['trip-id']}`)}
                    >
                      View Itinerary
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </BaseLayout>
  );
}

export default TripList;
