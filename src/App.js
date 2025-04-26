// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './login';
import Default from './Default';
import RegisterPage from './RegisterPage';
import HomePage from './HomePage';
import NewPostPage from './NewPostPage';
import EditPostPage from './EditPostPage';
import TripList from './TripList'
import NewTripPage from './NewTripPage';
import ItineraryPage from './ItineraryPage';
import TripDetail from './TripDetail';
import TripSplit from './TripSplit';
import SharedTripDetail from './SharedTripDetail';
import FindTripsPage from './FindTripsPage';
function App() {
  // return (
  //   <Router>
  //     <Routes>
  //       <Route path="/" element={<Default />} />
  //       <Route path="/login" element={<Login />} />
  //       <Route path="/register" element={<RegisterPage />} />
  //       <Route path="/register" element={<HomePage />} />
  //     </Routes>
  //   </Router>
  // );
  const isAuthenticated = true; // Set this based on actual authentication logic

  return (
    <Router>
      {/* <NavBar isAuthenticated={isAuthenticated} /> */}
      <Routes>
        {/* HomePage Route */}
        <Route path="/home" element={<HomePage isAuthenticated={isAuthenticated} />} />

        {/* Redirect root path to /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes (Requires Authentication) */}
        <Route path="/trips" element={isAuthenticated ? <TripList /> : <Login />} />
        <Route path="/new-trip" element={isAuthenticated ? <NewTripPage /> : <Login />} />
        <Route path="/trip/:id" element={isAuthenticated ? <TripDetail /> : <Login />} />
        <Route path="/shared-trip/:id" element={isAuthenticated ? <SharedTripDetail /> : <Login />} />
        <Route path="/itinerary" element={isAuthenticated ? <ItineraryPage /> : <Login />} />
        <Route path="/trip-split" element={isAuthenticated ? <TripSplit /> : <Login />} />


        {/* Post Routes */}
        <Route path="/new-post" element={isAuthenticated ? <NewPostPage /> : <Login />} />
        <Route path="/edit-post/:postId" element={isAuthenticated ? <EditPostPage /> : <Login />} />

        {/* Find Trips Page */}
        <Route path="/find-trips" element={<FindTripsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
