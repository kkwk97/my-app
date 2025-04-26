import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
// import '../styles/style.css';

const BaseLayout = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token'); // You'll need to implement proper auth

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">Travel Blog</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/home">Home</Link>
              </li>
              {isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/find-trips">Find Trips</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/trips">My Trips</Link>
                  </li>
                </>
              )}
            </ul>
            <ul className="navbar-nav">
              {isAuthenticated ? (
                <li className="nav-item">
                  <button 
                    className="nav-link" 
                    onClick={() => {
                      localStorage.removeItem('token');
                      navigate('/login');
                    }}
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        {children}
      </div>

     
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA74UbU1Wwv6pLjJerlhSCI3gIWbzcyLQs"></script>
    </div>
  );
};

export default BaseLayout;