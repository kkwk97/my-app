// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import BaseLayout from './BaseLayout';

// // Fix for default marker icons in Leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//     iconUrl: require('leaflet/dist/images/marker-icon.png'),
//     shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// });


// const GOOGLE_MAPS_API_KEY = 'AIzaSyA74UbU1Wwv6pLjJerlhSCI3gIWbzcyLQs'; // Replace with your actual API key

// const TripDetail = () => {
//     const { tripId } = useParams();
//     const [trip, setTrip] = useState(null);
//     const [duration, setDuration] = useState(null);
//     const [isPublic, setIsPublic] = useState(false);
//     const [expenses, setExpenses] = useState([]);
//     const currentUser = localStorage.getItem('userId') ;
//     const [currentDay, setCurrentDay] = useState(1);
//     const [locations, setLocations] = useState([]);
//     const [markers, setMarkers] = useState([]);
//     const [sharedUsers, setSharedUsers] = useState([]);
//     const [showAddLocationModal, setShowAddLocationModal] = useState(false);
//     const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
//     const [newLocation, setNewLocation] = useState({
//         name: '',
//         address: '',
//         time: '',
//         notes: '',
//         latitude: '',
//         longitude: ''
//     });
//     const [geocoder, setGeocoder] = useState(null);
//     const [map, setMap] = useState(null);

//     const handleLocationChange = (e) => {
//         const { name, value } = e.target;
//         setNewLocation(prevState => ({
//             ...prevState,
//             [name]: value
//         }));
//     };

//     const removeSharedUser = async (userId) => {
//         try {
//             const response = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips/${tripId}/${currentUser}/${userId}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 }
//             });
            
//             const data = await response.json();
            
//             if (response.ok) {
//                 // Update shared users list
//                 setSharedUsers(prevUsers => 

//                     prevUsers.filter(user => user.id !== userId)
//                 );
//             } else {
//                 console.error('Error removing shared user:', data);
//                 alert(`Error removing shared user: ${data.error || 'Unknown error'}`);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             alert('Failed to remove shared user. Please try again.');
//         }
//     };


//     const handleAddressChange = (e) => {
//         const address = e.target.value;
//         setNewLocation(prev => ({
//             ...prev,
//             address: address
//         }));

//         // Only attempt geocoding if Google Maps is loaded
//         if (window.google && window.google.maps && address.length > 2) {
//             setTimeout(() => {
//                 geocodeAddress(address);
//             }, 500);
//         }
//     };

//     const geocodeAddress = (address) => {
//         if (!window.google || !window.google.maps) {
//             console.error('Google Maps API not loaded');
//             return;
//         }

//         const geocoder = new window.google.maps.Geocoder();
//         geocoder.geocode({ address: address }, (results, status) => {
//             if (status === 'OK' && results[0]) {
//                 const location = results[0].geometry.location;
//                 console.log('Geocoding results:', results[0]);

//                 setNewLocation(prev => ({
//                     ...prev,
//                     latitude: location.lat(),
//                     longitude: location.lng(),
//                     name: prev.name || results[0].formatted_address
//                 }));
//             } else {
//                 console.error('Geocode was not successful:', status);
//             }
//         });
//     };

//     const togglePublic = async () => {
//         try {
//             const response = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips/mytrip/toggle-trip`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     "tripId": tripId,
//                     "userId": "test"
//                 })
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 setIsPublic(data.is_public);
//             }
//         } catch (error) {
//             console.error("Error toggling visibility:", error);
//         }
//     };

//     useEffect(() => {
//         if (trip) {
//             setIsPublic(trip.is_public || false);
//         }
//     }, [trip]);

//     useEffect(() => {
//         fetchTrip();
//         loadSharedUsers();
//     }, [tripId]);

//     useEffect(() => {
//         if (trip) {
//             loadLocations();
//         }
//     }, [currentDay, trip]);

//     // Initialize Google Maps script
//     useEffect(() => {
//         const loadGoogleMaps = () => {
//             return new Promise((resolve, reject) => {
//                 if (window.google && window.google.maps) {
//                     resolve();
//                     return;
//                 }

//                 // Remove any existing Google Maps script
//                 const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
//                 if (existingScript) {
//                     existingScript.remove();
//                 }

//                 const script = document.createElement('script');
//                 script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
//                 script.async = true;
//                 script.defer = true;
//                 script.onload = () => resolve();
//                 script.onerror = () => reject(new Error('Failed to load Google Maps API'));
//                 document.head.appendChild(script);
//             });
//         };

//         loadGoogleMaps()
//             .then(() => {
//                 console.log('Google Maps API loaded successfully');
//             })
//             .catch(error => {
//                 console.error('Error loading Google Maps API:', error);
//             });
//     }, []);

//     const fetchTrip = async () => {
//         try {
//             const response = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips/get_trip_details/${tripId}`);
//             const data = await response.json();
//             setTrip(data.trip);
//             setDuration(data.duration)
//         } catch (error) {
//             console.error('Error fetching trip:', error);
//         }
//     };

//    // Add this function before the return statement
//     const unshareTrip = async (userId) => {
//         try {
//             const response = await fetch(`/api/trips/${tripId}/unshare`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     trip_id: tripId,
//                     user_id: userId
//                 })
//             });

//             if (response.ok) {
//                 // Remove the user from the shared users list
//                 setSharedUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
//             } else {
//                 const error = await response.json();
//                 console.error('Error unsharing trip:', error);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     // Add this function before the return statement
//     const handleExpenseSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const formData = new FormData(e.target);
//             const description = formData.get('description');
//             const amount = parseFloat(formData.get('amount'));
//             const paidBy = formData.get('paid_by');
//             const sharedBy = Array.from(formData.getAll('shared_by'));

//             const response = await fetch(`/api/trips/${tripId}/expenses`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     trip_id: tripId,
//                     description,
//                     amount,
//                     paid_by: paidBy,
//                     shared_by: sharedBy,
//                     day_number: currentDay
//                 })
//             });

//             if (response.ok) {
//                 const expense = await response.json();

//                 // Update expenses list
//                 setExpenses(prevExpenses => [...prevExpenses, expense]);

//                 // Close modal
//                 setShowAddExpenseModal(false);
//             } else {
//                 const error = await response.json();
//                 console.error('Error adding expense:', error);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     const loadLocations = async () => {
//         try {
//             const response = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/location/load-location`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     trip_id: tripId,
//                     day_number: currentDay,
//                     user_id: "test"  // Replace with actual user ID
//                 })
//             });

//             if (response.ok) {
//                 const locations = await response.json();
//                 setLocations(locations);

//                 // Add markers to map
//                 const newMarkers = locations.map(location => ({
//                     position: [location.latitude, location.longitude],
//                     popup: (
//                         <div>
//                             <strong>{location.name}</strong>
//                             {location.time && <p>Time: {location.time}</p>}
//                             {location.notes && <p>Notes: {location.notes}</p>}
//                             <button
//                                 className="btn btn-danger btn-sm mt-2"
//                                 onClick={() => deleteLocation(location.id)}
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     )
//                 }));

//                 setMarkers(newMarkers);

//                 // Fit map bounds to show all markers
//                 if (map && newMarkers.length > 0) {
//                     const bounds = L.latLngBounds(newMarkers.map(m => m.position));
//                     map.fitBounds(bounds);
//                 }
//             }
//         } catch (error) {
//             console.error('Error loading locations:', error);
//         }
//     };

//     const loadSharedUsers = async () => {
//         try {
//             const response = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips/load_shared_users/${tripId}`);
//             const data = await response.json();

//             if (response.ok) {
//                 setSharedUsers(data.shared_users);
//             } else {
//                 console.error('Error loading shared users:', data);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     const updateMapMarkers = (locations) => {
//         const newMarkers = locations.map(location => ({
//             position: [location.latitude, location.longitude],
//             popup: (
//                 <div>
//                     <strong>{location.name}</strong>
//                     {location.time && <p>Time: {location.time}</p>}
//                     {location.notes && <p>Notes: {location.notes}</p>}
//                     <button
//                         className="btn btn-danger btn-sm mt-2"
//                         onClick={() => deleteLocation(location.id)}
//                     >
//                         Delete
//                     </button>
//                 </div>
//             )
//         }));
//         setMarkers(newMarkers);
//     };

//     const addLocationToMap = (location) => {
//         // Create a new marker for the location
//         const newMarker = {
//             position: [location.latitude, location.longitude],
//             popup: (
//                 <div>
//                     <strong>{location.name}</strong>
//                     {location.time && <p>Time: {location.time}</p>}
//                     {location.notes && <p>Notes: {location.notes}</p>}
//                     <button
//                         className="btn btn-danger btn-sm mt-2"
//                         onClick={() => deleteLocation(location.id)}
//                     >
//                         Delete
//                     </button>
//                 </div>
//             )
//         };

//         // Update the markers state
//         setMarkers(prevMarkers => [...prevMarkers, newMarker]);

//         // If we have a map reference, fit bounds to include the new marker
//         if (map) {
//             const bounds = L.latLngBounds(markers.map(m => m.position));
//             bounds.extend(newMarker.position);
//             map.fitBounds(bounds);
//         }
//     };

//     const handleLocationSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/location/create-location`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     ...newLocation,
//                     tripId: tripId,
//                     dayNumber: currentDay
//                 })
//             });

//             if (response.ok) {
//                 const location = await response.json();
//                 addLocationToMap(location);

//                 // Update the locations list
//                 setLocations(prevLocations => [...prevLocations, location]);

//                 // Reset the form
//                 setNewLocation({
//                     name: '',
//                     address: '',
//                     time: '',
//                     notes: '',
//                     latitude: '',
//                     longitude: ''
//                 });

//                 // Close the modal
//                 setShowAddLocationModal(false);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     const deleteLocation = async (locationId) => {
//         try {
//             const response = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/location/delete-location/${locationId}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 }
//             });

//             if (response.ok) {
//                 // Remove location from state
//                 setLocations(prevLocations =>
//                     prevLocations.filter(loc => loc.id !== locationId)
//                 );

//                 // Remove marker from map
//                 setMarkers(prevMarkers =>
//                     prevMarkers.filter(marker => marker.id !== locationId)
//                 );
//             } else {
//                 const error = await response.json();
//                 console.error('Error deleting location:', error);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     const handleShareTrip = async (e) => {
//         e.preventDefault();
//         const formData = new FormData(e.target);
//         const data = {
//             username_or_email: formData.get('username_or_email'),
//             can_edit: formData.get('can_edit') === 'on',
//             trip_id: tripId,
//             current_user_id:  localStorage.getItem('userId')  // You'll need to get this from your auth context
//         };

//         try {
//             const response = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips/share_trip`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(data)
//             });

//             const responseData = await response.json();


//             if (response.ok) {
//                 // Refresh shared users list
//                 loadSharedUsers();
//                 e.target.reset();
//             } else {
//                 console.error('Error sharing trip:', responseData);
//                 alert(`Error sharing trip: ${responseData.error || 'Unknown error'}`);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             alert('Failed to share trip. Please try again.');
//         }
//     };

//     const [expenses, setExpenses] = useState([]);
//     const [summary, setSummary] = useState([]);
//     const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
//     const [newExpense, setNewExpense] = useState({
//       description: "",
//       amount: "",
//       splits: [],
//     });

//     useEffect(() => {
//       fetchExpenses();
//     }, [trip.id]);

//     const fetchExpenses = async () => {
//       try {
//         const response = await fetch(`/expenses/${trip.id}/user/${yourUserId}`);
//         const data = await response.json();
//         setExpenses(data);

//         const computedSummary = computeSummary(data);
//         setSummary(computedSummary);
//       } catch (error) {
//         console.error("Error fetching expenses:", error);
//       }
//     };

//     const computeSummary = (expenses) => {
//       const userTotals = {};

//       expenses.forEach((expense) => {
//         const payer = expense.paid_by;
//         userTotals[payer] = userTotals[payer] || { spent: 0, owed: 0 };
//         userTotals[payer].spent += parseFloat(expense.amount);

//         expense.splits.forEach((split) => {
//           userTotals[split.username] = userTotals[split.username] || { spent: 0, owed: 0 };
//           userTotals[split.username].owed += parseFloat(split.amount || 0);
//         });
//       });

//       return Object.keys(userTotals).map((name) => ({
//         name,
//         spent: userTotals[name].spent.toFixed(2),
//         owed: userTotals[name].owed.toFixed(2),
//         balance: (userTotals[name].spent - userTotals[name].owed).toFixed(2),
//       }));
//     };


//     if (!trip) return <div>Loading...</div>;

//     return (
//         <BaseLayout>
//         <div className="container mt-4">
//             <h1>{trip.title}</h1>
//             <p>{trip.description}</p>

//             {/* Days Navigation */}
//             <div className="mb-4">
//                 <div style={{ display: 'inline-block' }}>
//                     <h3>Days</h3>
//                     <button
//                         type="button"
//                         className={`btn btn-sm ${isPublic ? 'btn-success' : 'btn-primary'}`}
//                         onClick={togglePublic}
//                     >
//                         {isPublic ? 'Make Private' : 'Make Public'}
//                     </button>
//                 </div>
//                 <select
//                   className="form-select"
//                   value={currentDay}
//                   onChange={(e) => setCurrentDay(parseInt(e.target.value))}
//                 >
//                   {Array.from({ length: duration }, (_, i) => (
//                     <option key={i + 1} value={i + 1}>
//                       Day {i + 1}
//                     </option>
//                   ))}
//                 </select>
//             </div>

//             {/* Map and Locations Container */}
//             <div className="row">
//                 <div className="col-md-8">
//                     <MapContainer
//                         center={[0, 0]}
//                         zoom={2}
//                         style={{ height: '400px' }}
//                         whenCreated={map => {
//                             // Fit bounds when markers are added
//                             if (markers.length > 0) {
//                                 const bounds = L.latLngBounds(markers.map(m => m.position));
//                                 map.fitBounds(bounds);
//                             }
//                         }}
//                     >
//                         <TileLayer
//                             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                             attribution='© OpenStreetMap contributors'
//                         />
//                         {markers.map((marker, index) => (
//                             <Marker key={index} position={marker.position}>
//                                 <Popup>{marker.popup}</Popup>
//                             </Marker>
//                         ))}
//                     </MapContainer>
//                 </div>
//                 <div className="col-md-4">
//                     <div className="card">
//                         <div className="card-header d-flex justify-content-between align-items-center">
//                             <h5 className="card-title mb-0">Locations</h5>
//                             <button
//                                 className="btn btn-primary btn-sm"
//                                 onClick={() => setShowAddLocationModal(true)}
//                             >
//                                 Add Location
//                             </button>
//                         </div>
//                         <div className="card-body">
//                             {locations.map(location => (
//                                 <div key={location.id} className="card mb-2">
//                                     <div className="card-body">
//                                         <h5 className="card-title">{location.name}</h5>
//                                         <p className="card-text">
//                                             <small className="text-muted">
//                                                 Time: {location.time || 'Not specified'}
//                                             </small>
//                                         </p>
//                                         <p className="card-text">{location.notes || ''}</p>
//                                         <button
//                                             className="btn btn-danger btn-sm"
//                                             onClick={() => deleteLocation(location.id)}
//                                         >
//                                             Delete
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Share Trip Section */}
//             <div className="card mb-4">
//                 <div className="card-header">
//                     <h5 className="mb-0">Share Trip</h5>
//                 </div>
//                 <div className="card-body">
//                     <form onSubmit={handleShareTrip}>
//                         <div className="mb-3">
//                             <label htmlFor="username_or_email" className="form-label">
//                                 Username or Email
//                             </label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 id="username_or_email"
//                                 name="username_or_email"
//                                 required
//                             />
//                         </div>
//                         <div className="mb-3">
//                             <div className="form-check">
//                                 <input
//                                     className="form-check-input"
//                                     type="checkbox"
//                                     id="can_edit"
//                                     name="can_edit"
//                                 />
//                                 <label className="form-check-label" htmlFor="can_edit">
//                                     Allow editing
//                                 </label>
//                             </div>
//                         </div>
//                         <button type="submit" className="btn btn-primary">Share</button>
//                     </form>

//                     <div className="mt-4">
//                         <h6>Shared With</h6>
//                         <div>
//                             {sharedUsers.map(user => (
//                                 <div key={user.id} className="d-flex justify-content-between align-items-center mb-2">
//                                     <span>{user.username}</span>
//                                     <button
//                                         className="btn btn-sm btn-danger"
//                                         onClick={() => removeSharedUser(user.id)}
//                                     >
//                                         Remove
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Add Location Modal */}
//             {showAddLocationModal && (
//                 <div className="modal show" style={{ display: 'block' }}>
//                     <div className="modal-dialog">
//                         <div className="modal-content">
//                         <div className="modal-header">
//                                 <h5 className="modal-title">Add Location</h5>
//                                 <button
//                                     type="button"
//                                     className="btn-close"
//                                     onClick={() => setShowAddLocationModal(false)}
//                                 ></button>
//                             </div>
//                             <div className="modal-body">
//                                 <form id="addLocationForm" onSubmit={handleLocationSubmit}>
//                                     <div className="mb-3">
//                                         <label htmlFor="location-name" className="form-label">Location Name</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             id="location-name"
//                                             name="name"
//                                             value={newLocation.name}
//                                             onChange={handleLocationChange}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="mb-3">
//                                         <label htmlFor="location-address" className="form-label">Address</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             id="location-address"
//                                             name="address"
//                                             value={newLocation.address}
//                                             onChange={handleAddressChange}
//                                             placeholder="Enter address..."
//                                         />
//                                         {newLocation.latitude && newLocation.longitude && (
//                                             <div className="mt-2">
//                                                 <small className="text-muted">
//                                                     Coordinates: {newLocation.latitude}, {newLocation.longitude}
//                                                 </small>
//                                             </div>
//                                         )}
//                                     </div>
//                                     <div className="mb-3">
//                                         <label htmlFor="location-time" className="form-label">Time</label>
//                                         <input
//                                             type="time"
//                                             className="form-control"
//                                             id="location-time"
//                                             name="time"
//                                             value={newLocation.time}
//                                             onChange={handleLocationChange}
//                                         />
//                                     </div>
//                                     <div className="mb-3">
//                                         <label htmlFor="location-notes" className="form-label">Notes</label>
//                                         <textarea
//                                             className="form-control"
//                                             id="location-notes"
//                                             name="notes"
//                                             value={newLocation.notes}
//                                             onChange={handleLocationChange}
//                                             rows="3"
//                                         ></textarea>
//                                     </div>
//                                     <input type="hidden" name="latitude" value={newLocation.latitude} />
//                                     <input type="hidden" name="longitude" value={newLocation.longitude} />
//                                 </form>
//                             </div>
//                             <div className="modal-footer">
//                                 <button
//                                     type="button"
//                                     className="btn btn-secondary"
//                                     onClick={() => setShowAddLocationModal(false)}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className="btn btn-primary"
//                                     onClick={handleLocationSubmit}
//                                 >
//                                     Save Location
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/*show expense summary table*/}
//             <div className="card mt-4">
//               <div className="card-header">
//                 <h5 className="mb-0">Trip Expenses Summary</h5>
//               </div>
//               <div className="card-body p-0">
//                 <table className="table table-striped mb-0">
//                   <thead className="table-light">
//                     <tr>
//                       <th>User</th>
//                       <th>Total Spent</th>
//                       <th>Total Owed</th>
//                       <th>Balance</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {summary.map((item, idx) => (
//                       <tr key={idx}>
//                         <td>{item.name}</td>
//                         <td>${item.spent}</td>
//                         <td>${item.owed}</td>
//                         <td className={parseFloat(item.balance) >= 0 ? "text-success" : "text-danger"}>
//                           {parseFloat(item.balance) >= 0 ? "+" : ""}
//                           ${item.balance}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>


//             {/* Add Expense Modal */}
//             {showAddExpenseModal && (
//                 <div className="modal show" style={{ display: 'block' }}>
//                     <div className="modal-dialog">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title">Add New Expense</h5>
//                                 <button
//                                     type="button"
//                                     className="btn-close"
//                                     onClick={() => setShowAddExpenseModal(false)}
//                                 ></button>
//                             </div>
//                             <div className="modal-body">
//                                 <form onSubmit={handleExpenseSubmit}>
//                                     <div className="mb-3">
//                                         <label htmlFor="description" className="form-label">
//                                             Expense Description
//                                         </label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="description"
//                                             required
//                                         />
//                                     </div>
//                                     <div className="mb-3">
//                                         <label htmlFor="amount" className="form-label">
//                                             Amount
//                                         </label>
//                                         <input
//                                             type="number"
//                                             step="0.01"
//                                             className="form-control"
//                                             name="amount"
//                                             required
//                                         />
//                                     </div>
//                                     <div className="mb-3">
//                                         <label htmlFor="paid_by" className="form-label">
//                                             Paid By
//                                         </label>
//                                         <select name="paid_by" className="form-select" required>
//                                             {trip?.participants?.map(user => (
//                                                 <option key={user.id} value={user.id}>
//                                                     {user.username}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                     <div className="mb-3">
//                                         <label className="form-label">Shared By</label>
//                                         {trip?.participants?.map(user => (
//                                             <div key={user.id} className="form-check">
//                                                 <input
//                                                     className="form-check-input"
//                                                     type="checkbox"
//                                                     name="shared_by"
//                                                     value={user.id}
//                                                     defaultChecked
//                                                 />
//                                                 <label className="form-check-label">
//                                                     {user.username}
//                                                 </label>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </form>
//                             </div>
//                             <div className="modal-footer">
//                                 <button
//                                     type="button"
//                                     className="btn btn-secondary"
//                                     onClick={() => setShowAddExpenseModal(false)}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className="btn btn-primary"
//                                     onClick={handleExpenseSubmit}
//                                 >
//                                     Add Expense
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/*expense detail*/}
// //            <div className="card mt-4">
// //              <div className="card-header">
// //                <h5 className="mb-0">Trip Expenses Details</h5>
// //              </div>
// //              <div className="card-body p-0">
// //                <table className="table table-striped mb-0">
// //                  <thead className="table-light">
// //                    <tr>
// //                      <th>S/N</th>
// //                      <th>Expense</th>
// //                      <th>Amount</th>
// //                      <th>Paid By</th>
// //                      <th>Shared By</th>
// //                      <th>Per Person</th>
// //                    </tr>
// //                  </thead>
// //                  <tbody>
// //                    {expenses.map((expense, idx) => (
// //                      <tr key={expense.id}>
// //                        <td>{idx + 1}</td>
// //                        <td>{expense.description}</td>
// //                        <td>${expense.amount}</td>
// //                        <td>{expense.paid_by}</td>
// //                        <td>{expense.splits.map((split) => split.username).join(", ")}</td>
// //                        <td>
// //                          ${(
// //                            parseFloat(expense.amount) / (expense.splits.length || 1)
// //                          ).toFixed(2)}
// //                        </td>
// //                      </tr>
// //                    ))}
// //                  </tbody>
// //                </table>
// //              </div>
// //            </div>

//         </div>
//         </BaseLayout>
//     );
// };

// export default TripDetail;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import BaseLayout from './BaseLayout';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


const GOOGLE_MAPS_API_KEY = 'AIzaSyA74UbU1Wwv6pLjJerlhSCI3gIWbzcyLQs'; // Replace with your actual API key

const TripDetail = () => {
    const { tripId } = useParams();
    const [users, setUsers] = useState([]);
    const [setTripId] = useState('');
    const [trip, setTrip] = useState(null);
    const [duration, setDuration] = useState(null);
    const [isPublic, setIsPublic] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const currentUser = localStorage.getItem('userId') ;
    const [currentDay, setCurrentDay] = useState(1);
    const [locations, setLocations] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [sharedUsers, setSharedUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showAddLocationModal, setShowAddLocationModal] = useState(false);
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [paidById, setPaidById] = useState('');
    const [sharedByIds, setSharedByIds] = useState('');

    useEffect(() => {
    if (!tripId) return;
        const loadSharedUsers = async () => {
        try {
            const res = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips/load_shared_users/${tripId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
            });
            const data = await res.json();
            if (res.ok) {
            // your Lambda returns { shared_users: [...] }
               
            setUsers(data.shared_users || []);

            } else {
            console.error('Error loading shared users:', data);
            }
        } catch (err) {
            console.error('Network error fetching shared users:', err);
        }
        };

        loadSharedUsers();
    }, [tripId]);
    
    const [newLocation, setNewLocation] = useState({
        name: '',
        address: '',
        time: '',
        notes: '',
        latitude: '',
        longitude: ''
    });
    const [geocoder, setGeocoder] = useState(null);
    const [map, setMap] = useState(null);

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setNewLocation(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const removeSharedUser = async (userId) => {
        try {
            const response = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips/${tripId}/${currentUser}/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Update shared users list
                setSharedUsers(prevUsers => 
                    prevUsers.filter(user => user.id !== userId)
                );
            } else {
                console.error('Error removing shared user:', data);
                alert(`Error removing shared user: ${data.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to remove shared user. Please try again.');
        }
    };
    

    const handleAddressChange = (e) => {
        const address = e.target.value;
        setNewLocation(prev => ({
            ...prev,
            address: address
        }));

        // Only attempt geocoding if Google Maps is loaded
        if (window.google && window.google.maps && address.length > 2) {
            setTimeout(() => {
                geocodeAddress(address);
            }, 500);
        }
    };

    const geocodeAddress = (address) => {
        if (!window.google || !window.google.maps) {
            console.error('Google Maps API not loaded');
            return;
        }

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;
                console.log('Geocoding results:', results[0]);
                
                setNewLocation(prev => ({
                    ...prev,
                    latitude: location.lat(),
                    longitude: location.lng(),
                    name: prev.name || results[0].formatted_address
                }));
            } else {
                console.error('Geocode was not successful:', status);
            }
        });
    };

    const togglePublic = async () => {
        try {
            const response = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips/mytrip/toggle-trip`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "tripId": tripId,
                    "userId": "test"
                })
            });

            if (response.ok) {
                const data = await response.json();
                setIsPublic(data.is_public);
            }
        } catch (error) {
            console.error("Error toggling visibility:", error);
        }
    };

    useEffect(() => {
        if (trip) {
            setIsPublic(trip.is_public || false);
        }
    }, [trip]);

    useEffect(() => {
        fetchTrip();
        loadSharedUsers();
    }, [tripId]);

    useEffect(() => {
        if (trip) {
            loadLocations();
        }
    }, [currentDay, trip]);

    // Initialize Google Maps script
    useEffect(() => {
        const loadGoogleMaps = () => {
            return new Promise((resolve, reject) => {
                if (window.google && window.google.maps) {
                    resolve();
                    return;
                }

                // Remove any existing Google Maps script
                const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
                if (existingScript) {
                    existingScript.remove();
                }

                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
                script.async = true;
                script.defer = true;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Failed to load Google Maps API'));
                document.head.appendChild(script);
            });
        };

        loadGoogleMaps()
            .then(() => {
                console.log('Google Maps API loaded successfully');
            })
            .catch(error => {
                console.error('Error loading Google Maps API:', error);
            });
    }, []);

    const fetchTrip = async () => {
        try {
            const response = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips/get_trip_details/${tripId}`);
            const data = await response.json();
            setTrip(data.trip);
            setDuration(data.duration)
        } catch (error) {
            console.error('Error fetching trip:', error);
        }
    };

   // Add this function before the return statement
    const unshareTrip = async (userId) => {
        try {
            const response = await fetch(`/api/trips/${tripId}/unshare`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    trip_id: tripId,
                    user_id: userId
                })
            });
            
            if (response.ok) {
                // Remove the user from the shared users list
                setSharedUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            } else {
                const error = await response.json();
                console.error('Error unsharing trip:', error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Add this function before the return statement
    const handleExpenseSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const description = formData.get('description');
            const amount = parseFloat(formData.get('amount'));
            const paidBy = formData.get('paid_by');
            const sharedBy = Array.from(formData.getAll('shared_by'));

            const response = await fetch(`/api/trips/${tripId}/expenses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    trip_id: tripId,
                    description,
                    amount,
                    paid_by: paidBy,
                    shared_by: sharedBy,
                    day_number: currentDay
                })
            });
            
            if (response.ok) {
                const expense = await response.json();
                
                // Update expenses list
                setExpenses(prevExpenses => [...prevExpenses, expense]);
                
                // Close modal
                setShowAddExpenseModal(false);
            } else {
                const error = await response.json();
                console.error('Error adding expense:', error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const loadLocations = async () => {
        try {
            const response = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/location/load-location`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    trip_id: tripId,
                    day_number: currentDay,
                    user_id: "test"  // Replace with actual user ID
                })
            });
            
            if (response.ok) {
                const locations = await response.json();
                setLocations(locations);
                
                // Add markers to map
                const newMarkers = locations.map(location => ({
                    position: [location.latitude, location.longitude],
                    popup: (
                        <div>
                            <strong>{location.name}</strong>
                            {location.time && <p>Time: {location.time}</p>}
                            {location.notes && <p>Notes: {location.notes}</p>}
                            <button 
                                className="btn btn-danger btn-sm mt-2"
                                onClick={() => deleteLocation(location.id)}
                            >
                                Delete
                            </button>
                        </div>
                    )
                }));
                
                setMarkers(newMarkers);
                
                // Fit map bounds to show all markers
                if (map && newMarkers.length > 0) {
                    const bounds = L.latLngBounds(newMarkers.map(m => m.position));
                    map.fitBounds(bounds);
                }
            }
        } catch (error) {
            console.error('Error loading locations:', error);
        }
    };

    const loadSharedUsers = async () => {
        try {
            const response = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips/load_shared_users/${tripId}`);
            const data = await response.json();
            
            if (response.ok) {
                setSharedUsers(data.shared_users);
            } else {
                console.error('Error loading shared users:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const updateMapMarkers = (locations) => {
        const newMarkers = locations.map(location => ({
            position: [location.latitude, location.longitude],
            popup: (
                <div>
                    <strong>{location.name}</strong>
                    {location.time && <p>Time: {location.time}</p>}
                    {location.notes && <p>Notes: {location.notes}</p>}
                    <button 
                        className="btn btn-danger btn-sm mt-2"
                        onClick={() => deleteLocation(location.id)}
                    >
                        Delete
                    </button>
                </div>
            )
        }));
        setMarkers(newMarkers);
    };

    const addLocationToMap = (location) => {
        // Create a new marker for the location
        const newMarker = {
            position: [location.latitude, location.longitude],
            popup: (
                <div>
                    <strong>{location.name}</strong>
                    {location.time && <p>Time: {location.time}</p>}
                    {location.notes && <p>Notes: {location.notes}</p>}
                    <button 
                        className="btn btn-danger btn-sm mt-2"
                        onClick={() => deleteLocation(location.id)}
                    >
                        Delete
                    </button>
                </div>
            )
        };

        // Update the markers state
        setMarkers(prevMarkers => [...prevMarkers, newMarker]);

        // If we have a map reference, fit bounds to include the new marker
        if (map) {
            const bounds = L.latLngBounds(markers.map(m => m.position));
            bounds.extend(newMarker.position);
            map.fitBounds(bounds);
        }
    };

    const handleLocationSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/location/create-location`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newLocation,
                    tripId: tripId,
                    dayNumber: currentDay
                })
            });
            
            if (response.ok) {
                const location = await response.json();
                addLocationToMap(location);
                
                // Update the locations list
                setLocations(prevLocations => [...prevLocations, location]);
                
                // Reset the form
                setNewLocation({
                    name: '',
                    address: '',
                    time: '',
                    notes: '',
                    latitude: '',
                    longitude: ''
                });
                
                // Close the modal
                setShowAddLocationModal(false);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteLocation = async (locationId) => {
        try {
            const response = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/location/delete-location/${locationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                // Remove location from state
                setLocations(prevLocations => 
                    prevLocations.filter(loc => loc.id !== locationId)
                );
                
                // Remove marker from map
                setMarkers(prevMarkers => 
                    prevMarkers.filter(marker => marker.id !== locationId)
                );
            } else {
                const error = await response.json();
                console.error('Error deleting location:', error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleShareTrip = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            username_or_email: formData.get('username_or_email'),
            can_edit: formData.get('can_edit') === 'on',
            trip_id: tripId,
            current_user_id:  localStorage.getItem('userId')  // You'll need to get this from your auth context
        };

        try {
            const response = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips/share_trip`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const responseData = await response.json();
            
            if (response.ok) {
                // Refresh shared users list
                loadSharedUsers();
                e.target.reset();
            } else {
                console.error('Error sharing trip:', responseData);
                alert(`Error sharing trip: ${responseData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to share trip. Please try again.');
        }
    };

    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newExpense, setNewExpense] = useState({
      description: "",
      amount: "",
      splits: [],
    });

    useEffect(() => {
    fetchExpenses();
      fetchExpenses2();
    }, [tripId]);

    const fetchExpenses2 = async () => {
        console.log("Trip ID:", tripId);
        console.log(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/get_expense/${tripId}/user/${localStorage.getItem('userId')}`);

        try {
          const response = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/get_expense/${tripId}/user/${localStorage.getItem('userId')}`, {
            method: 'GET',
            mode: 'cors',  // <---- add this
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log('Full response1111111111111:', response);
      
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
          }
      
          const data = await response.json();
          setSummary(data);
      
        //   const computedSummary = computeSummary(data);
        //   setSummary(computedSummary);
        } catch (error) {
          console.error("Error fetching expenses:", error);
        } finally {
            setLoading(false); // <---- Add this to stop loading spinner
          }
      };
    
    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        const payloadToAddExpense = {
        trip_id: tripId,
        description,
        amount,
        paid_by_id: paidById,
        shared_by_ids: sharedByIds
        };


        const res = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/create_expense`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadToAddExpense),
            });

        const data = await res.json();
        if (res.ok) {
            setMessage(data.message || 'Expense added!');
            // reset
            //setTripId('');
            console.log("here");
            console.log(paidById);
            console.log(sharedByIds);
            setDescription('');
            setAmount('');
            setPaidById('');
            setSharedByIds('');
            setShowForm(false);
            setTimeout(() => {
                window.location.reload();
            }, 5000);
        } else {
            setError(data.error || 'Failed to add expense');
        }
    }
        


    const computeSummary = (expenses) => {
      const userTotals = {};

      expenses.forEach((expense) => {
        const payer = expense.paid_by;
        userTotals[payer] = userTotals[payer] || { spent: 0, owed: 0 };
        userTotals[payer].spent += parseFloat(expense.amount);

        if (expense.splits) {
            expense.splits.forEach((split) => {
              userTotals[split.username] = userTotals[split.username] || { spent: 0, owed: 0 };
              userTotals[split.username].owed += parseFloat(split.amount || 0);
            });
          }
      });

      return Object.keys(userTotals).map((name) => ({
        name,
        spent: userTotals[name].spent.toFixed(2),
        owed: userTotals[name].owed.toFixed(2),
        balance: (userTotals[name].spent - userTotals[name].owed).toFixed(2),
      }));
    };


    const fetchExpenses = async () => {
        console.log("Trip ID:", tripId);
        console.log(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/manage_expense/${tripId}/user/${localStorage.getItem('userId')}`);

        try {
          const response = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/manage_expense/${tripId}/user/${localStorage.getItem('userId')}`, {
            method: 'GET',
            mode: 'cors',  // <---- add this
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log('Full response:', response);

            const responseData = await response.json();
                
            
            const expensesData = responseData;
            
            console.log('Fetched expenses:', expensesData);
            const processedExpenses = expensesData.map(expense => {
            // Process expenses to add shared_by and per_person info
            const splits = expense.splits || [];
            const splitUsernames = splits.map(split => split.user_id).join(', ');
            const totalSplitAmount = splits.reduce((sum, split) => sum + (split.amount || 0), 0);
            const perPerson = splits.length > 0 ? (totalSplitAmount / splits.length).toFixed(2) : 'N/A';


                return {
                    id: expense.id,
                    description: expense.description,
                    amount: parseFloat(expense.amount).toFixed(2),
                    paid_by: expense.paid_by_id,
                    shared_by: splitUsernames || 'N/A',
                    per_person: perPerson
                };
            });

            setExpenses(processedExpenses);
            setLoading(false);
            
        } catch (error) {
            console.error('Error fetching expenses:', error);
            setLoading(false);
        }
        };

    if (!trip) return <div>Loading...</div>;

    return (
        <BaseLayout>
        <div className="container mt-4">
            <h1>{trip.title}</h1>
            <p>{trip.description}</p>

            {/* Days Navigation */}
            <div className="mb-4">
                <div style={{ display: 'inline-block' }}>
                    <h3>Days</h3>
                    <button
                        type="button"
                        className={`btn btn-sm ${isPublic ? 'btn-success' : 'btn-primary'}`}
                        onClick={togglePublic}
                    >
                        {isPublic ? 'Make Private' : 'Make Public'}
                    </button>
                </div>
                <select
                  className="form-select"
                  value={currentDay}
                  onChange={(e) => setCurrentDay(parseInt(e.target.value))}
                >
                  {Array.from({ length: duration }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Day {i + 1}
                    </option>
                  ))}
                </select>
            </div>

            {/* Map and Locations Container */}
            <div className="row">
                <div className="col-md-8">
                    <MapContainer 
                        center={[0, 0]} 
                        zoom={2} 
                        style={{ height: '400px' }}
                        whenCreated={map => {
                            // Fit bounds when markers are added
                            if (markers.length > 0) {
                                const bounds = L.latLngBounds(markers.map(m => m.position));
                                map.fitBounds(bounds);
                            }
                        }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='© OpenStreetMap contributors'
                        />
                        {markers.map((marker, index) => (
                            <Marker key={index} position={marker.position}>
                                <Popup>{marker.popup}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="card-title mb-0">Locations</h5>
                            <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => setShowAddLocationModal(true)}
                            >
                                Add Location
                            </button>
                        </div>
                        <div className="card-body">
                            {locations.map(location => (
                                <div key={location.id} className="card mb-2">
                                    <div className="card-body">
                                        <h5 className="card-title">{location.name}</h5>
                                        <p className="card-text">
                                            <small className="text-muted">
                                                Time: {location.time || 'Not specified'}
                                            </small>
                                        </p>
                                        <p className="card-text">{location.notes || ''}</p>
                                        <button 
                                            className="btn btn-danger btn-sm"
                                            onClick={() => deleteLocation(location.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Trip Section */}
            <div className="card mb-4">
                <div className="card-header">
                    <h5 className="mb-0">Share Trip</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleShareTrip}>
                        <div className="mb-3">
                            <label htmlFor="username_or_email" className="form-label">
                                Username or Email
                            </label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="username_or_email" 
                                name="username_or_email"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <div className="form-check">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    id="can_edit"
                                    name="can_edit"
                                />
                                <label className="form-check-label" htmlFor="can_edit">
                                    Allow editing
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Share</button>
                    </form>

                    <div className="mt-4">
                        <h6>Shared With</h6>
                        <div>
                            {sharedUsers.map(user => (
                                <div key={user.id} className="d-flex justify-content-between align-items-center mb-2">
                                    <span>{user.username}</span>
                                    <button 
                                        className="btn btn-sm btn-danger"
                                        onClick={() => removeSharedUser(user.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Location Modal */}
            {showAddLocationModal && (
                <div className="modal show" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                                <h5 className="modal-title">Add Location</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowAddLocationModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form id="addLocationForm" onSubmit={handleLocationSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="location-name" className="form-label">Location Name</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="location-name"
                                            name="name"
                                            value={newLocation.name}
                                            onChange={handleLocationChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="location-address" className="form-label">Address</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="location-address"
                                            name="address"
                                            value={newLocation.address}
                                            onChange={handleAddressChange}
                                            placeholder="Enter address..."
                                        />
                                        {newLocation.latitude && newLocation.longitude && (
                                            <div className="mt-2">
                                                <small className="text-muted">
                                                    Coordinates: {newLocation.latitude}, {newLocation.longitude}
                                                </small>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="location-time" className="form-label">Time</label>
                                        <input 
                                            type="time" 
                                            className="form-control" 
                                            id="location-time"
                                            name="time"
                                            value={newLocation.time}
                                            onChange={handleLocationChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="location-notes" className="form-label">Notes</label>
                                        <textarea 
                                            className="form-control" 
                                            id="location-notes"
                                            name="notes"
                                            value={newLocation.notes}
                                            onChange={handleLocationChange}
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    <input type="hidden" name="latitude" value={newLocation.latitude} />
                                    <input type="hidden" name="longitude" value={newLocation.longitude} />
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setShowAddLocationModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-primary" 
                                    onClick={handleLocationSubmit}
                                >
                                    Save Location
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-sm mx-auto p-4 bg-white shadow rounded">
            <button
                onClick={() => setShowForm(open => !open)}
                style={{
                    marginBottom: '16px',
                    backgroundColor: '#28a745', // Green
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                    }}
                    onMouseOver={e => (e.target.style.backgroundColor = '#218838')}
                    onMouseOut={e => (e.target.style.backgroundColor = '#28a745')}
            >
                {showForm ? 'Cancel' : 'Add Expense'}
            </button>

            {showForm && (
                <form onSubmit={handleSubmit}  className="space-y-4 w-full">
                    {/* Description */}
                    <div  className="w-full">
                    <label className="block mb-1 font-medium">Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ width: '100%', marginBottom: '12px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        required
                    />
                    </div>

                    {/* Amount */}
                    <div>
                    <label className="block mb-1 font-medium">Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{ width: '100%', marginBottom: '12px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        required
                    />
                    </div>

                    {/* Paid By */}
                    <div>
                    <label className="block mb-1 font-medium">Paid By</label>
                    <select
                        value={paidById}
                        onChange={(e) => setPaidById(e.target.value)}
                        style={{ width: '100%', marginBottom: '12px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        required
                    >
                        <option value="">Select User</option>
                        <option value={currentUser}>
                        {currentUser}
                        </option>
                        {users.map((user) => (
                        <option key={user.username} value={user['id']}>
                            {user.username}
                        </option>
                        ))}
                    </select>
                    </div>

                    {/* Shared By */}
                    <div>
                    <label className="block mb-1 font-medium">Shared By</label>
                    <select
                        multiple
                        value={sharedByIds}
                        onChange={(e) =>
                        setSharedByIds(Array.from(e.target.selectedOptions, (opt) => opt.value))
                        }
                        style={{ width: '100%', marginBottom: '12px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        required
                    >
                        <option value={currentUser}>
                        {currentUser}
                        </option>
                        {users.map((user) => (
                        <option key={user['id']} value={user['id']}>
                            {user.username}
                        </option>
                        ))}
                    </select>
                    </div>

                    {/* Submit Button */}
                    <button
                    type="submit"
                    disabled={loading}
                     style={{
                    marginBottom: '16px',
                    backgroundColor: '#28a745', // Green
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                    }}
                    onMouseOver={e => (e.target.style.backgroundColor = '#218838')}
                    onMouseOut={e => (e.target.style.backgroundColor = '#28a745')}
                    >
                    {loading ? 'Adding...' : 'Add Expense'}
                    </button>
                </form>
                )}


            {message && <p className="mt-4 text-green-600">{message}</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
            </div>

              {/*show expense summary table*/}
              <div className="card mt-4">
              <div className="card-header">
                <h5 className="mb-0">Trip Expenses Summary</h5>
              </div>
              <div className="card-body p-0">
                <table className="table table-striped mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>User</th>
                      <th>Total Spent</th>
                      <th>Total Owed</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name}</td>
                        <td>${item.spent}</td>
                        <td>${item.owed}</td>
                        <td className={parseFloat(item.balance) >= 0 ? "text-success" : "text-danger"}>
                          {parseFloat(item.balance) >= 0 ? "+" : ""}
                          ${item.balance}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
    
        

            {/*expense detail */}
            <div className="card mt-4">
      <div className="card-header">
        <h5 className="mb-0">Trip Expenses Details</h5>
      </div>
      <div className="card-body p-0">
        <table className="table table-striped mb-0">
          <thead className="table-light">
            <tr>
              <th>S/N</th>
              <th>Expense</th>
              <th>Amount</th>
              <th>Paid By</th>
              <th>Shared By</th>
              <th>Per Person</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={expense.id || index}>

                <td>{index + 1}</td>
                <td>{expense.description}</td>
                <td>${expense.amount}</td>
                <td>{expense.paid_by}</td>
                <td>{expense.shared_by}</td>
                <td>${expense.per_person}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
        </div>
        </BaseLayout>
    );
};

export default TripDetail;
