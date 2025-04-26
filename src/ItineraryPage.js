// src/pages/ItineraryPage.js
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import BaseLayout from './BaseLayout';

const AddLocationPicker = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    }
  });
  return null;
};

const ItineraryPage = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    place: '',
    date: '',
    notes: '',
    latitude: '',
    longitude: '',
  });
  const [markerPos, setMarkerPos] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/itinerary'); // adjust if needed
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Failed to load itinerary items', err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleMapClick = (latlng) => {
    setMarkerPos(latlng);
    setFormData({ ...formData, latitude: latlng.lat, longitude: latlng.lng });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/itinerary/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setFormData({ place: '', date: '', notes: '', latitude: '', longitude: '' });
        setMarkerPos(null);
        fetchItems(); // Refresh list
      }
    } catch (err) {
      console.error('Failed to add stop', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/itinerary/${id}/delete`, {
        method: 'POST'
      });
      if (res.ok) {
        setItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  return (
    <BaseLayout>
    <div className="row mt-4">
      <div className="col-md-4">
        <div className="card mb-4">
          <div className="card-header"><h5 className="mb-0">Add New Stop</h5></div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="place" className="form-label">Place</label>
                <input
                  type="text"
                  className="form-control"
                  id="place"
                  value={formData.place}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="date" className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="notes" className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  id="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Location</label>
                <div style={{ height: '200px' }}>
                  <MapContainer center={[0, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <AddLocationPicker onSelect={handleMapClick} />
                    {markerPos && <Marker position={markerPos} />}
                  </MapContainer>
                </div>
                <small className="text-muted">Click on the map to set location</small>
              </div>
              <button type="submit" className="btn btn-primary">Add Stop</button>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h5 className="mb-0">My Itinerary</h5></div>
          <div className="card-body">
            {items.length > 0 ? items.map(item => (
              <div key={item.id} className="itinerary-item mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">{item.place}</h6>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
                <small className="text-muted">{item.date}</small>
                {item.notes && <p className="mb-0">{item.notes}</p>}
              </div>
            )) : <p>No stops added yet.</p>}
          </div>
        </div>
      </div>

      <div className="col-md-8">
        <div style={{ height: '600px' }}>
          <MapContainer center={[0, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {items.map(item => (
              item.latitude && item.longitude && (
                <Marker
                  key={item.id}
                  position={[item.latitude, item.longitude]}
                />
              )
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
    </BaseLayout>
  );
};

export default ItineraryPage;
