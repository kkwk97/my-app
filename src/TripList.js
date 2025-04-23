import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // To handle routing to trip detail page
import BaseLayout
 from "./BaseLayout";
function TripList() {
  const [ownedTrips, setOwnedTrips] = useState([]);
  const [sharedTrips, setSharedTrips] = useState([]);

  // Fetch owned trips
  useEffect(() => {
    const fetchOwnedTrips = async () => {
      try {
        const response = await fetch('/api/owned_trips'); // Replace with the correct endpoint
        if (response.ok) {
          const data = await response.json();
          setOwnedTrips(data);
        } else {
          console.error("Failed to fetch owned trips");
        }
      } catch (error) {
        console.error("Error fetching owned trips:", error);
      }
    };

    fetchOwnedTrips();
  }, []);

  // Fetch shared trips
  useEffect(() => {
    const fetchSharedTrips = async () => {
      try {
        const response = await fetch('/api/shared_trips'); // Replace with the correct endpoint
        if (response.ok) {
          const data = await response.json();
          setSharedTrips(data);
        } else {
          console.error("Failed to fetch shared trips");
        }
      } catch (error) {
        console.error("Error fetching shared trips:", error);
      }
    };

    fetchSharedTrips();
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
                      to={`/trip/${trip.id}`}
                      className="btn btn-primary"
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
                        Shared by {trip.user.username}
                      </small>
                    </p>
                    <Link
                      to={`/trip/${trip.id}`}
                      className="btn btn-primary"
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
    </div>
    </BaseLayout>
  );
}

export default TripList;
