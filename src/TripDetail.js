// // import React, { useState, useEffect, useRef } from "react";
// // import L from "leaflet"; // Leaflet for the map
// // import "leaflet/dist/leaflet.css";
// // import { useNavigate, useParams } from 'react-router-dom';

// // function TripDetail({ trip }) {
// //   const { tripId } = useParams();
// //   const [currentDay, setCurrentDay] = useState(1);
// //   const [locations, setLocations] = useState([]);
// //   const [sharedUsers, setSharedUsers] = useState([]);
// //   const [isPublic, setIsPublic] = useState(trip.is_public);
  
// //   const [locationForm, setLocationForm] = useState({
// //     name: "",
// //     time: "",
// //     notes: "",
// //     latitude: "",
// //     longitude: "",
// //   });
// //   const [usernameOrEmail, setUsernameOrEmail] = useState("");
// //   const [canEdit, setCanEdit] = useState(false);

// //   const mapRef = useRef();

// //   // Initialize map
// //   useEffect(() => {
// //     const map = L.map(mapRef.current).setView([0, 0], 2);  // Default view
// //     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
// //       attribution: "© OpenStreetMap contributors",
// //     }).addTo(map);

// //     // Update markers when the current day changes
// //     const updateMapMarkers = (dayNumber) => {
// //       const markers = [];
// //       fetch(`/itinerary/trips/${trip.id}/days/${dayNumber}/locations`)
// //         .then((response) => response.json())
// //         .then((locations) => {
// //           locations.forEach((location) => {
// //             if (location.latitude && location.longitude) {
// //               const marker = L.marker([location.latitude, location.longitude])
// //                 .addTo(map)
// //                 .bindPopup(`<b>${location.name}</b><br>${location.notes || ""}`);
// //               markers.push(marker);
// //             }
// //           });

// //           // Fit map to show all markers
// //           if (markers.length > 0) {
// //             const group = L.featureGroup(markers);
// //             map.fitBounds(group.getBounds());
// //           } else {
// //             map.setView([0, 0], 2);
// //           }
// //         })
// //         .catch((error) => console.error("Error updating markers:", error));
// //     };

// //     updateMapMarkers(currentDay);

// //     return () => {
// //       // Cleanup map when component unmounts
// //       map.remove();
// //     };
// //   }, [currentDay, trip.id]);

// //   // Fetch locations for the current day
// //   useEffect(() => {
// //     fetch(`/itinerary/trips/${trip.id}/days/${currentDay}/locations`)
// //       .then((response) => response.json())
// //       .then((data) => setLocations(data))
// //       .catch((error) => console.error("Error fetching locations:", error));
// //   }, [currentDay, trip.id]);

// //     // Fetch locations for the current day
// //     useEffect(() => {
// //       fetch(`/itinerary/trips/${trip.id}/days/${currentDay}/locations`)
// //         .then((response) => response.json())
// //         .then((data) => setLocations(data))
// //         .catch((error) => console.error("Error fetching locations:", error));
// //     }, [currentDay, trip.id]);
  

// //   // Handle day selection
// //   const handleDayChange = (e) => {
// //     setCurrentDay(parseInt(e.target.value));
// //   };

// //   // Toggle trip visibility (public/private)
// //   const togglePublic = async () => {
// //     try {
// //       const response = await fetch(`/itinerary/trips/${trip.id}/toggle_public`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //       });

// //       if (response.ok) {
// //         const data = await response.json();
// //         setIsPublic(data.is_public);
// //       }
// //     } catch (error) {
// //       console.error("Error toggling visibility:", error);
// //     }
// //   };

// //   // Share trip
// //   const handleShare = async (e) => {
// //     e.preventDefault();

// //     // Use state values
// //     const usernameOrEmail = usernameOrEmail;
// //     const canEdit = canEdit;

// //     try {
// //       const response = await fetch(`/itinerary/trips/${trip.id}/share`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ username_or_email: usernameOrEmail, can_edit: canEdit }),
// //       });

// //       if (response.ok) {
// //         loadSharedUsers();
// //         e.target.reset();
// //       } else {
// //         alert("Failed to share trip");
// //       }
// //     } catch (error) {
// //       console.error("Error sharing trip:", error);
// //       alert("Failed to share trip");
// //     }
// //   };

// //   // Load shared users
// //   const loadSharedUsers = async () => {
// //     try {
// //       const response = await fetch(`/itinerary/trips/${trip.id}/shared`);
// //       if (response.ok) {
// //         const users = await response.json();
// //         setSharedUsers(users);
// //       }
// //     } catch (error) {
// //       console.error("Error loading shared users:", error);
// //     }
// //   };

// //   // Remove user from shared list
// //   const unshareTrip = async (userId) => {
// //     if (window.confirm("Are you sure you want to remove this user?")) {
// //       try {
// //         const response = await fetch(`/itinerary/trips/${trip.id}/unshare/${userId}`, {
// //           method: "POST",
// //         });

// //         if (response.ok) {
// //           loadSharedUsers();
// //         } else {
// //           alert("Failed to remove user");
// //         }
// //       } catch (error) {
// //         console.error("Error removing user:", error);
// //         alert("Failed to remove user");
// //       }
// //     }
// //   };

// //   // Save location
// //   const saveLocation = async (e) => {
// //     e.preventDefault();

// //     const { name, time, notes, latitude, longitude } = locationForm;

// //     const data = {
// //       name,
// //       time,
// //       notes,
// //       latitude: parseFloat(latitude),
// //       longitude: parseFloat(longitude),
// //     };

// //     try {
// //       const response = await fetch(`/itinerary/trips/${trip.id}/days/${currentDay}/add_location`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify(data),
// //       });

// //       if (response.ok) {
// //         const newLocation = await response.json();
// //         setLocations((prevLocations) => [...prevLocations, newLocation]);
// //         setLocationForm({ name: "", time: "", notes: "", latitude: "", longitude: "" }); // Reset form
// //         loadSharedUsers(); // Refresh shared users
// //       } else {
// //         alert("Failed to save location");
// //       }
// //     } catch (error) {
// //       console.error("Error saving location:", error);
// //       alert("Failed to save location");
// //     }
// //   };

// //   // Handle form input changes
// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setLocationForm((prevForm) => ({ ...prevForm, [name]: value }));
// //   };

// //   return (
// //     <div className="container mt-4">
// //       {/* Existing JSX goes here */}
// //     </div>
// //   );
// // }

// // export default TripDetail;

// // import React, { useState, useEffect, useRef } from "react";
// // import L from "leaflet"; // Leaflet for the map
// // import "leaflet/dist/leaflet.css";
// // import { useNavigate, useParams } from 'react-router-dom';

// // function TripDetail({ }) {
// //   const { postId } = useParams();
// //   const [currentDay, setCurrentDay] = useState(1);
// //   const [locations, setLocations] = useState([]);
// //   const [sharedUsers, setSharedUsers] = useState([]);
// //   const [isPublic, setIsPublic] = useState(trip.is_public);
  
// //   const [locationForm, setLocationForm] = useState({
// //     name: "",
// //     time: "",
// //     notes: "",
// //     latitude: "",
// //     longitude: "",
// //   });
// //   const [usernameOrEmail, setUsernameOrEmail] = useState("");
// //   const [canEdit, setCanEdit] = useState(false);

// //   const mapRef = useRef();

// //   // Initialize map
// //   useEffect(() => {
// //     const map = L.map(mapRef.current).setView([0, 0], 2);  // Default view
// //     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
// //       attribution: "© OpenStreetMap contributors",
// //     }).addTo(map);

// //     // Update markers when the current day changes
// //     const updateMapMarkers = (dayNumber) => {
// //       const markers = [];
// //       fetch(`/itinerary/trips/${trip.id}/days/${dayNumber}/locations`)
// //         .then((response) => response.json())
// //         .then((locations) => {
// //           locations.forEach((location) => {
// //             if (location.latitude && location.longitude) {
// //               const marker = L.marker([location.latitude, location.longitude])
// //                 .addTo(map)
// //                 .bindPopup(`<b>${location.name}</b><br>${location.notes || ""}`);
// //               markers.push(marker);
// //             }
// //           });

// //           // Fit map to show all markers
// //           if (markers.length > 0) {
// //             const group = L.featureGroup(markers);
// //             map.fitBounds(group.getBounds());
// //           } else {
// //             map.setView([0, 0], 2);
// //           }
// //         })
// //         .catch((error) => console.error("Error updating markers:", error));
// //     };

// //     updateMapMarkers(currentDay);

// //     return () => {
// //       // Cleanup map when component unmounts
// //       map.remove();
// //     };
// //   }, [currentDay, trip.id]);

// //   // Fetch locations for the current day
// //   useEffect(() => {
// //     fetch(`/itinerary/trips/${trip.id}/days/${currentDay}/locations`)
// //       .then((response) => response.json())
// //       .then((data) => setLocations(data))
// //       .catch((error) => console.error("Error fetching locations:", error));
// //   }, [currentDay, trip.id]);

// //   // Handle day selection
// //   const handleDayChange = (e) => {
// //     setCurrentDay(parseInt(e.target.value));
// //   };

// //   // Toggle trip visibility (public/private)
// //   const togglePublic = async () => {
// //     try {
// //       const response = await fetch(`/itinerary/trips/${trip.id}/toggle_public`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //       });

// //       if (response.ok) {
// //         const data = await response.json();
// //         setIsPublic(data.is_public);
// //       }
// //     } catch (error) {
// //       console.error("Error toggling visibility:", error);
// //     }
// //   };

// //   // Share trip
// //   const handleShare = async (e) => {
// //     e.preventDefault();

// //     // Use state values
// //     const usernameOrEmail = usernameOrEmail;
// //     const canEdit = canEdit;

// //     try {
// //       const response = await fetch(`/itinerary/trips/${trip.id}/share`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ username_or_email: usernameOrEmail, can_edit: canEdit }),
// //       });

// //       if (response.ok) {
// //         loadSharedUsers();
// //         e.target.reset();
// //       } else {
// //         alert("Failed to share trip");
// //       }
// //     } catch (error) {
// //       console.error("Error sharing trip:", error);
// //       alert("Failed to share trip");
// //     }
// //   };

// //   // Load shared users
// //   const loadSharedUsers = async () => {
// //     try {
// //       const response = await fetch(`/itinerary/trips/${trip.id}/shared`);
// //       if (response.ok) {
// //         const users = await response.json();
// //         setSharedUsers(users);
// //       }
// //     } catch (error) {
// //       console.error("Error loading shared users:", error);
// //     }
// //   };

// //   // Remove user from shared list
// //   const unshareTrip = async (userId) => {
// //     if (window.confirm("Are you sure you want to remove this user?")) {
// //       try {
// //         const response = await fetch(`/itinerary/trips/${trip.id}/unshare/${userId}`, {
// //           method: "POST",
// //         });

// //         if (response.ok) {
// //           loadSharedUsers();
// //         } else {
// //           alert("Failed to remove user");
// //         }
// //       } catch (error) {
// //         console.error("Error removing user:", error);
// //         alert("Failed to remove user");
// //       }
// //     }
// //   };

// //   // Save location
// //   const saveLocation = async (e) => {
// //     e.preventDefault();

// //     const { name, time, notes, latitude, longitude } = locationForm;

// //     const data = {
// //       name,
// //       time,
// //       notes,
// //       latitude: parseFloat(latitude),
// //       longitude: parseFloat(longitude),
// //     };

// //     try {
// //       const response = await fetch(`/itinerary/trips/${trip.id}/days/${currentDay}/add_location`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify(data),
// //       });

// //       if (response.ok) {
// //         const newLocation = await response.json();
// //         setLocations((prevLocations) => [...prevLocations, newLocation]);
// //         setLocationForm({ name: "", time: "", notes: "", latitude: "", longitude: "" }); // Reset form
// //         loadSharedUsers(); // Refresh shared users
// //       } else {
// //         alert("Failed to save location");
// //       }
// //     } catch (error) {
// //       console.error("Error saving location:", error);
// //       alert("Failed to save location");
// //     }
// //   };

// //   // Handle form input changes
// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setLocationForm((prevForm) => ({ ...prevForm, [name]: value }));
// //   };

// //   return (
// //     <div className="container mt-4">
// //       {/* Existing JSX goes here */}
// //     </div>
// //   );
// // }

// // export default TripDetail;

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import BaseLayout from './BaseLayout';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// const TripDetail = () => {
//   const { tripId } = useParams();
//   const navigate = useNavigate();
//   const [trip, setTrip] = useState(null);
//   const [currentDay, setCurrentDay] = useState(1);
//   const [locations, setLocations] = useState([]);
//   const [map, setMap] = useState(null);
//   const [markers, setMarkers] = useState([]);
//   const [sharedUsers, setSharedUsers] = useState([]);
//   const [showAddLocationModal, setShowAddLocationModal] = useState(false);
//   const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
//   const [newLocation, setNewLocation] = useState({
//     name: '',
//     address: '',
//     time: '',
//     notes: '',
//     latitude: '',
//     longitude: ''
//   });

//   // Initialize map
//   useEffect(() => {
//     // Wait for the DOM to be ready
//     const mapContainer = document.getElementById('map');
//     if (!mapContainer) return;

//     // Check if map is already initialized
//     if (map) return;

//     const mapInstance = L.map(mapContainer).setView([0, 0], 2);
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '© OpenStreetMap contributors'
//     }).addTo(mapInstance);
//     setMap(mapInstance);

//     return () => {
//       if (mapInstance) {
//         mapInstance.remove();
//       }
//     };
//   }, [map]); // Add map to dependencies

//   useEffect(() => {
//     console.log("Fetching post with ID:", tripId);
//     const fetchTripDetails = async () => {
//       try {
//         const response = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips/get_trip_details/${tripId}`);
//         if (response.ok) {
//           const data = await response.json();
//           setTrip(data);
//         }
//       } catch (error) {
//         console.error('Error fetching trip details:', error);
//       }
//     };

//     if (tripId) {  // Add this check
//       fetchTripDetails();
//     }
//   }, [tripId]);  // Add tripId to dependencies

//   // Fetch locations for current day
//   useEffect(() => {
//     const fetchLocations = async () => {
//       try {
//         const response = await fetch(`/itinerary/trips/${tripId}/days/${currentDay}/locations`);
//         if (response.ok) {
//           const data = await response.json();
//           setLocations(data);
//           updateMapMarkers(data);
//         }
//       } catch (error) {
//         console.error('Error fetching locations:', error);
//       }
//     };

//     if (tripId && currentDay) {
//       fetchLocations();
//     }
//   }, [tripId, currentDay]);

//   // Update map markers
//   const updateMapMarkers = (locations) => {
//     if (!map) return;

//     // Clear existing markers
//     markers.forEach(marker => {
//       if (marker && map.hasLayer(marker)) {
//         map.removeLayer(marker);
//       }
//     });
//     const newMarkers = [];

//     locations.forEach(location => {
//       if (location.latitude && location.longitude) {
//         const marker = L.marker([location.latitude, location.longitude])
//           .addTo(map)
//           .bindPopup(`<b>${location.name}</b><br>${location.notes || ''}`);
//         newMarkers.push(marker);
//       }
//     });

//     setMarkers(newMarkers);

//     // Fit map to show all markers
//     if (newMarkers.length > 0) {
//       const group = L.featureGroup(newMarkers);
//       map.fitBounds(group.getBounds());
//     } else {
//       map.setView([0, 0], 2);
//     }
//   };

//   // Handle location save
//   const handleSaveLocation = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`/itinerary/trips/${tripId}/days/${currentDay}/add_location`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...newLocation,
//           day_number: currentDay
//         })
//       });

//       if (response.ok) {
//         setShowAddLocationModal(false);
//         setNewLocation({
//           name: '',
//           address: '',
//           time: '',
//           notes: '',
//           latitude: '',
//           longitude: ''
//         });
//         // Refresh locations
//         const updatedLocations = await response.json();
//         setLocations(updatedLocations);
//       }
//     } catch (error) {
//       console.error('Error saving location:', error);
//     }
//   };

//   // Handle location delete
//   const handleDeleteLocation = async (locationId) => {
//     if (window.confirm('Are you sure you want to delete this location?')) {
//       try {
//         const response = await fetch(`/itinerary/trips/${tripId}/days/${currentDay}/locations/${locationId}`, {
//           method: 'DELETE'
//         });

//         if (response.ok) {
//           // Remove the deleted location from state
//           setLocations(locations.filter(loc => loc.id !== locationId));
//         }
//       } catch (error) {
//         console.error('Error deleting location:', error);
//       }
//     }
//   };

  

//   // Load shared users
//   const loadSharedUsers = async () => {
//     try {
//       const response = await fetch(`/itinerary/trips/${tripId}/shared`);
//       if (response.ok) {
//         const data = await response.json();
//         setSharedUsers(data);
//       }
//     } catch (error) {
//       console.error('Error loading shared users:', error);
//     }
//   };

//   if (!trip) {
//     return <div>Loading...</div>;
//   }

//   const handleAddExpense = async (e) => {
//     e.preventDefault();
//     try {
//       const expenseData = {
//         name: e.target.expenseName.value,
//         amount: parseFloat(e.target.expenseAmount.value),
//         category: e.target.expenseCategory.value,
//         day: currentDay
//       };

//       const response = await fetch(`/itinerary/trips/${tripId}/expenses`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(expenseData)
//       });

//       if (response.ok) {
//         // Close modal and reset form
//         setShowAddExpenseModal(false);
//         e.target.reset();
//         // You might want to refresh the expenses list here
//       } else {
//         const error = await response.json();
//         alert(error.error || 'Failed to add expense');
//       }
//     } catch (error) {
//       console.error('Error adding expense:', error);
//       alert('Failed to add expense');
//     }
//   };

//   // Handle sharing trip
//   const handleShareTrip = async (e) => {
//     e.preventDefault();
//     try {
//       const shareData = {
//         username_or_email: e.target.username_or_email.value,
//         can_edit: e.target.can_edit.checked
//       };

//       const response = await fetch(`/itinerary/trips/${tripId}/share`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(shareData)
//       });

//       if (response.ok) {
//         // Refresh shared users list
//         loadSharedUsers();
//         e.target.reset();
//       } else {
//         const error = await response.json();
//         alert(error.error || 'Failed to share trip');
//       }
//     } catch (error) {
//       console.error('Error sharing trip:', error);
//       alert('Failed to share trip');
//     }
//   };



//   return (
//     <BaseLayout>
//       <div className="container mt-4">
//         <h1>{trip.title}</h1>
//         <p>{trip.description}</p>

//         {/* Days Navigation */}
//         <div className="mb-4">
//           <div style={{ display: 'inline-block' }}>
//             <h3>Days</h3>
//             <button
//               type="button"
//               className="btn btn-primary btn-sm"
//               onClick={() => setShowAddLocationModal(true)}
//             >
//               Add Location
//             </button>
//           </div>

//           <select
//             className="form-select"
//             value={currentDay}
//             onChange={(e) => setCurrentDay(parseInt(e.target.value))}
//           >
//             {Array.from({ length: trip.duration }, (_, i) => (
//               <option key={i + 1} value={i + 1}>
//                 Day {i + 1}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Map and Locations Container */}
//         <div className="row">
//           <div className="col-md-8">
//             <div id="map" style={{ height: '400px', width: '100%' }}></div>
//           </div>
//           <div className="col-md-4">
//             <div className="card">
//               <div className="card-header d-flex justify-content-between align-items-center">
//                 <h5 className="card-title mb-0">Locations</h5>
//                 <button
//                   type="button"
//                   className="btn btn-primary btn-sm"
//                   onClick={() => setShowAddLocationModal(true)}
//                 >
//                   Add Location
//                 </button>
//               </div>
//               <div className="card-body">
//                 {locations.map((location) => (
//                   <div key={location.id} className="card mb-2">
//                     <div className="card-body">
//                       <h5 className="card-title">{location.name}</h5>
//                       <p className="card-text">
//                         <small className="text-muted">
//                           Time: {location.time || 'Not specified'}
//                         </small>
//                       </p>
//                       <p className="card-text">{location.notes || ''}</p>
//                       <button
//                         className="btn btn-danger btn-sm"
//                         onClick={() => handleDeleteLocation(location.id)}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Share Trip Section */}
//         <div className="card mb-4">
//           <div className="card-header">
//             <h5 className="mb-0">Share Trip</h5>
//           </div>
//           <div className="card-body">
//             <form onSubmit={handleShareTrip}>
//               <div className="mb-3">
//                 <label htmlFor="username_or_email" className="form-label">
//                   Username or Email
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="username_or_email"
//                   name="username_or_email"
//                   required
//                 />
//               </div>
//               <div className="mb-3">
//                 <div className="form-check">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id="can_edit"
//                     name="can_edit"
//                   />
//                   <label className="form-check-label" htmlFor="can_edit">
//                     Allow editing
//                   </label>
//                 </div>
//               </div>
//               <button type="submit" className="btn btn-primary">
//                 Share
//               </button>
//             </form>

//             <div className="mt-4">
//               <h6>Shared With</h6>
//               <div id="sharedWithList">
//                 {sharedUsers.map((user) => (
//                   <div key={user.id} className="d-flex justify-content-between align-items-center mb-2">
//                     <span>{user.username}</span>
//                     <span className="badge bg-secondary">
//                       {user.can_edit ? 'Can Edit' : 'View Only'}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Add Location Modal */}
//         {showAddLocationModal && (
//           <div className="modal show" style={{ display: 'block' }}>
//             <div className="modal-dialog">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title">Add Location</h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={() => setShowAddLocationModal(false)}
//                   ></button>
//                 </div>
//                 <div className="modal-body">
//                   <form onSubmit={handleSaveLocation}>
//                     <div className="mb-3">
//                       <label htmlFor="name" className="form-label">Name</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="name"
//                         value={newLocation.name}
//                         onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
//                         required
//                       />
//                     </div>
//                     <div className="mb-3">
//                       <label htmlFor="address" className="form-label">Address</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="address"
//                         value={newLocation.address}
//                         onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
//                         required
//                       />
//                     </div>
//                     <div className="mb-3">
//                       <label htmlFor="time" className="form-label">Time</label>
//                       <input
//                         type="time"
//                         className="form-control"
//                         id="time"
//                         value={newLocation.time}
//                         onChange={(e) => setNewLocation({ ...newLocation, time: e.target.value })}
//                       />
//                     </div>
//                     <div className="mb-3">
//                       <label htmlFor="notes" className="form-label">Notes</label>
//                       <textarea
//                         className="form-control"
//                         id="notes"
//                         value={newLocation.notes}
//                         onChange={(e) => setNewLocation({ ...newLocation, notes: e.target.value })}
//                       ></textarea>
//                     </div>
//                     <button type="submit" className="btn btn-primary">Save Location</button>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Add Expense Section */}
//         <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
//           <h5 className="mb-0">Expenses</h5>
//           <button
//             className="btn btn-success btn-sm"
//             onClick={() => setShowAddExpenseModal(true)}
//           >
//             Add Expense
//           </button>
//         </div>

//         {/* Add Expense Modal */}
//         {showAddExpenseModal && (
//           <div className="modal show" style={{ display: 'block' }}>
//             <div className="modal-dialog">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title">Add Expense</h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={() => setShowAddExpenseModal(false)}
//                   ></button>
//                 </div>
//                 <div className="modal-body">
//                   <form onSubmit={handleAddExpense}>
//                     <div className="mb-3">
//                       <label htmlFor="expenseName" className="form-label">Name</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="expenseName"
//                         required
//                       />
//                     </div>
//                     <div className="mb-3">
//                       <label htmlFor="expenseAmount" className="form-label">Amount</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         id="expenseAmount"
//                         step="0.01"
//                         required
//                       />
//                     </div>
//                     <div className="mb-3">
//                       <label htmlFor="expenseCategory" className="form-label">Category</label>
//                       <select className="form-select" id="expenseCategory" required>
//                         <option value="">Select Category</option>
//                         <option value="transportation">Transportation</option>
//                         <option value="accommodation">Accommodation</option>
//                         <option value="food">Food</option>
//                         <option value="activities">Activities</option>
//                         <option value="other">Other</option>
//                       </select>
//                     </div>
//                     <button type="submit" className="btn btn-primary">Add Expense</button>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </BaseLayout>
//   );
// }

// export default TripDetail;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import BaseLayout from './BaseLayout';

const TripDetail = () => {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [duration, setDuration] = useState(null);
    const [isPublic, setIsPublic] = useState(false);


    const [currentDay, setCurrentDay] = useState(1);
    const [locations, setLocations] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [sharedUsers, setSharedUsers] = useState([]);
    const [showAddLocationModal, setShowAddLocationModal] = useState(false);
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [newLocation, setNewLocation] = useState({
        name: '',
        address: '',
        time: '',
        notes: '',
        latitude: '',
        longitude: ''
    });

       
  
    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setNewLocation(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

      // Toggle trip visibility (public/private)
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

    const fetchTrip = async () => {
        try {
            //copy here
            
            const response = await fetch(`https://dp0zpyerpl.execute-api.ap-southeast-2.amazonaws.com/UAT/trips/get_trip_details/${tripId}`);
            const data = await response.json();
            setTrip(data.trip);
            setDuration(data.duration)
        } catch (error) {
            console.error('Error fetching trip:', error);
        }
    };

    const loadLocations = async () => {
        try {
            const response = await fetch(`/api/trips/${id}/days/${currentDay}/locations`);
            const data = await response.json();
            setLocations(data);
            updateMapMarkers(data);
        } catch (error) {
            console.error('Error loading locations:', error);
        }
    };

    const loadSharedUsers = async () => {
        try {
            const response = await fetch(`/api/trips/${id}/shared`);
            const data = await response.json();
            setSharedUsers(data);
        } catch (error) {
            console.error('Error loading shared users:', error);
        }
    };

    const updateMapMarkers = (locations) => {
        const newMarkers = locations.map(location => ({
            position: [location.latitude, location.longitude],
            popup: (
                <div>
                    <strong>{location.name}</strong>
                    {location.time && <p>Time: {location.time}</p>}
                    {location.notes && <p>{location.notes}</p>}
                    <button onClick={() => deleteLocation(location.id)}>Delete</button>
                </div>
            )
        }));
        setMarkers(newMarkers);
    };

    const handleLocationSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/trips/${id}/days/${currentDay}/add_location`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newLocation)
            });
            if (response.ok) {
                setShowAddLocationModal(false);
                setNewLocation({
                    name: '',
                    address: '',
                    time: '',
                    notes: '',
                    latitude: '',
                    longitude: ''
                });
                loadLocations();
            }
        } catch (error) {
            console.error('Error saving location:', error);
        }
    };

    const deleteLocation = async (locationId) => {
        if (window.confirm('Are you sure you want to delete this location?')) {
            try {
                const response = await fetch(`/api/trips/${id}/days/${currentDay}/locations/${locationId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    loadLocations();
                }
            } catch (error) {
                console.error('Error deleting location:', error);
            }
        }
    };

    const handleShareTrip = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            username_or_email: formData.get('username_or_email'),
            can_edit: formData.get('can_edit') === 'on'
        };

        try {
            const response = await fetch(`/api/trips/${id}/share`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                loadSharedUsers();
                e.target.reset();
            }
        } catch (error) {
            console.error('Error sharing trip:', error);
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
                    {/* <button 
                        className="btn btn-primary btn-sm" 
                        // onClick={() => setShowAddLocationModal(true)}
                    >
                        Make Public
                    </button> */}
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
                                        onClick={() => unshareTrip(user.id)}
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
                                <form onSubmit={handleLocationSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="location-name" className="form-label">
                                            Location Name
                                        </label>
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
                                        <label htmlFor="location-address" className="form-label">
                                            Address
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="location-address"
                                            name="address"
                                            value={newLocation.address}
                                            onChange={handleLocationChange}
                                            placeholder="Enter address..."
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="location-time" className="form-label">
                                            Time
                                        </label>
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
                                        <label htmlFor="location-notes" className="form-label">
                                            Notes
                                        </label>
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

            {/* Add Expense Modal */}
            {showAddExpenseModal && (
                <div className="modal show" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Expense</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowAddExpenseModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleExpenseSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">
                                            Expense Description
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="description"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="amount" className="form-label">
                                            Amount
                                        </label>
                                        <input 
                                            type="number" 
                                            step="0.01" 
                                            className="form-control" 
                                            name="amount"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="paid_by" className="form-label">
                                            Paid By
                                        </label>
                                        <select name="paid_by" className="form-select" required>
                                            {trip?.participants?.map(user => (
                                                <option key={user.id} value={user.id}>
                                                    {user.username}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Shared By</label>
                                        {trip?.participants?.map(user => (
                                            <div key={user.id} className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="checkbox" 
                                                    name="shared_by" 
                                                    value={user.id}
                                                    defaultChecked
                                                />
                                                <label className="form-check-label">
                                                    {user.username}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setShowAddExpenseModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-primary" 
                                    onClick={handleExpenseSubmit}
                                >
                                    Add Expense
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </BaseLayout>
    );
};

export default TripDetail;
