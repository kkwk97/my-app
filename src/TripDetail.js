import React, { useState, useEffect, useRef } from "react";
import L from "leaflet"; // Leaflet for the map
import "leaflet/dist/leaflet.css";

function TripDetail({ trip }) {
  const [currentDay, setCurrentDay] = useState(1);
  const [locations, setLocations] = useState([]);
  const [sharedUsers, setSharedUsers] = useState([]);
  const [isPublic, setIsPublic] = useState(trip.is_public);
  const [locationForm, setLocationForm] = useState({
    name: "",
    time: "",
    notes: "",
    latitude: "",
    longitude: "",
  });
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [canEdit, setCanEdit] = useState(false);

  const mapRef = useRef();

  // Initialize map
  useEffect(() => {
    const map = L.map(mapRef.current).setView([0, 0], 2);  // Default view
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Update markers when the current day changes
    const updateMapMarkers = (dayNumber) => {
      const markers = [];
      fetch(`/itinerary/trips/${trip.id}/days/${dayNumber}/locations`)
        .then((response) => response.json())
        .then((locations) => {
          locations.forEach((location) => {
            if (location.latitude && location.longitude) {
              const marker = L.marker([location.latitude, location.longitude])
                .addTo(map)
                .bindPopup(`<b>${location.name}</b><br>${location.notes || ""}`);
              markers.push(marker);
            }
          });

          // Fit map to show all markers
          if (markers.length > 0) {
            const group = L.featureGroup(markers);
            map.fitBounds(group.getBounds());
          } else {
            map.setView([0, 0], 2);
          }
        })
        .catch((error) => console.error("Error updating markers:", error));
    };

    updateMapMarkers(currentDay);

    return () => {
      // Cleanup map when component unmounts
      map.remove();
    };
  }, [currentDay, trip.id]);

  // Fetch locations for the current day
  useEffect(() => {
    fetch(`/itinerary/trips/${trip.id}/days/${currentDay}/locations`)
      .then((response) => response.json())
      .then((data) => setLocations(data))
      .catch((error) => console.error("Error fetching locations:", error));
  }, [currentDay, trip.id]);

  // Handle day selection
  const handleDayChange = (e) => {
    setCurrentDay(parseInt(e.target.value));
  };

  // Toggle trip visibility (public/private)
  const togglePublic = async () => {
    try {
      const response = await fetch(`/itinerary/trips/${trip.id}/toggle_public`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsPublic(data.is_public);
      }
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  // Share trip
  const handleShare = async (e) => {
    e.preventDefault();

    // Use state values
    const usernameOrEmail = usernameOrEmail;
    const canEdit = canEdit;

    try {
      const response = await fetch(`/itinerary/trips/${trip.id}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username_or_email: usernameOrEmail, can_edit: canEdit }),
      });

      if (response.ok) {
        loadSharedUsers();
        e.target.reset();
      } else {
        alert("Failed to share trip");
      }
    } catch (error) {
      console.error("Error sharing trip:", error);
      alert("Failed to share trip");
    }
  };

  // Load shared users
  const loadSharedUsers = async () => {
    try {
      const response = await fetch(`/itinerary/trips/${trip.id}/shared`);
      if (response.ok) {
        const users = await response.json();
        setSharedUsers(users);
      }
    } catch (error) {
      console.error("Error loading shared users:", error);
    }
  };

  // Remove user from shared list
  const unshareTrip = async (userId) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      try {
        const response = await fetch(`/itinerary/trips/${trip.id}/unshare/${userId}`, {
          method: "POST",
        });

        if (response.ok) {
          loadSharedUsers();
        } else {
          alert("Failed to remove user");
        }
      } catch (error) {
        console.error("Error removing user:", error);
        alert("Failed to remove user");
      }
    }
  };

  // Save location
  const saveLocation = async (e) => {
    e.preventDefault();

    const { name, time, notes, latitude, longitude } = locationForm;

    const data = {
      name,
      time,
      notes,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    try {
      const response = await fetch(`/itinerary/trips/${trip.id}/days/${currentDay}/add_location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newLocation = await response.json();
        setLocations((prevLocations) => [...prevLocations, newLocation]);
        setLocationForm({ name: "", time: "", notes: "", latitude: "", longitude: "" }); // Reset form
        loadSharedUsers(); // Refresh shared users
      } else {
        alert("Failed to save location");
      }
    } catch (error) {
      console.error("Error saving location:", error);
      alert("Failed to save location");
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocationForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  return (
    <div className="container mt-4">
      {/* Existing JSX goes here */}
    </div>
  );
}

export default TripDetail;
