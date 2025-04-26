import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import BaseLayout from './BaseLayout';

// Default Leaflet marker fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const SharedTripDetail = ({ tripId }) => {
  const [trip, setTrip] = useState(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [locations, setLocations] = useState([]);

  // Fetch trip data
  useEffect(() => {
    fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips/get_public_trip/${tripId}`)
      .then(res => res.json())
      .then(data => {
        setTrip(data);
        setCurrentDay(1); // default to day 1
      })
      .catch(err => console.error('Error fetching trip:', err));
  }, [tripId]);

  // Fetch locations when trip or day changes
  useEffect(() => {
    if (trip) {
      fetch(`/api/trips/${tripId}/days/${currentDay}/locations`)
        .then(res => res.json())
        .then(data => setLocations(data))
        .catch(err => console.error('Error fetching locations:', err));
    }
  }, [trip, currentDay, tripId]);

  const handleDayChange = (e) => {
    setCurrentDay(Number(e.target.value));
  };

  const handleDeleteLocation = (locationId) => {
    if (!window.confirm('Delete this location?')) return;

    fetch(`/api/trips/${tripId}/locations/${locationId}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete');
        // Remove from UI
        setLocations(locations.filter(loc => loc.id !== locationId));
      })
      .catch(err => {
        console.error(err);
        alert('Error deleting location.');
      });
  };

  return (
    <BaseLayout>
    <div className="container mt-4">
      {trip ? (
        <>
          <h1>{trip.title}</h1>
          <p>{trip.description}</p>

          <div className="mb-4">
            <h3>Days</h3>
            <select className="form-select" value={currentDay} onChange={handleDayChange}>
              {Array.from({ length: trip.duration }, (_, i) => (
                <option key={i + 1} value={i + 1}>Day {i + 1}</option>
              ))}
            </select>
          </div>

          <div className="row">
            <div className="col-md-8 mb-3">
              <MapContainer center={[0, 0]} zoom={2} scrollWheelZoom={true} style={{ height: '400px' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {locations.map((loc) => (
                  <Marker
                    key={loc.id}
                    position={[loc.latitude, loc.longitude]}
                  >
                    <Popup>
                      <strong>{loc.name}</strong><br />
                      {loc.time && <div><strong>Time:</strong> {loc.time}</div>}
                      {loc.notes && <div>{loc.notes}</div>}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            <div className="col-md-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Locations</h5>
                </div>
                <div className="card-body">
                  {locations.length > 0 ? (
                    locations.map(loc => (
                      <div key={loc.id} className="card mb-2">
                        <div className="card-body">
                          <h5 className="card-title">{loc.name}</h5>
                          <p className="card-text">
                            <small className="text-muted">Time: {loc.time || 'Not specified'}</small>
                          </p>
                          <p className="card-text">{loc.notes || ''}</p>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteLocation(loc.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No locations added for this day.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading trip...</p>
      )}
    </div>
    </BaseLayout>
  );
};

export default SharedTripDetail;
