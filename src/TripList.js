import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BaseLayout from './BaseLayout';
import { useNavigate } from 'react-router-dom';

const TripList = () => {
  const [trips, setTrips] = useState([]);
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


  const [searchParams, setSearchParams] = useState({
    title: '',
    country: '',
    from_date: '',
    to_date: ''
  });
  // const userId = localStorage.getItem('userId');

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
      setSharedTrips(data.sharedTrips || []);
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
      setSharedTrips(data.shared_trips || []);
    })
    .catch(err => console.error('Error fetching trips:', err));
  };

  // useEffect(() => {
  //   // Initial fetch
  //   fetch('https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ user_id: userId })
  //   })
  //   .then(res => res.json())
  //   .then(data => {
  //     setTrips(data.owned_trips || []);
  //   })
  //   .catch(err => console.error('Error fetching trips:', err));
  // }, []);

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
        <h2>My Trips</h2>
        
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

        {/* <div className="row">
          {ownedTrips.map(trip => (
            <div className="col-md-4 mb-4" key={trip['trip-id']}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{trip.title}</h5>
                  <p className="card-text">
                    {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                  </p>
                  <Link
                    to={`/trip/${trip['trip-id']}`}
                    className="btn btn-primary"
                  >
                    View Itinerary
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div> */}

        {/* <div className="row">
          {sharedTrips.map(trip => (
            <div className="col-md-4 mb-4" key={trip['trip-id']}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{trip.title}</h5>
                  <p className="card-text">
                    {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                  </p>
                  <Link
                    to={`/trip/${trip['trip-id']}`}
                    className="btn btn-primary"
                  >
                    View Itinerary
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div> */}

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
      </div>
      
    </BaseLayout>
  );
};

export default TripList;
