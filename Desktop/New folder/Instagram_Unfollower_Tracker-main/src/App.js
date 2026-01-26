import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'; // Import the App.css file
import CheckUnfollower from './components/CheckUnfollower';
import Instructions from './components/Instructions'; // Import Instructions component
import Ok from './components/ok'; // Import Ok component
import Contact from './components/contact'; // Import Contact component

function App() {
  return (
    <Router basename="/Instagram_Unfollower_Tracker"> {/* Add basename for GitHub Pages */}
      <div className="App">
        <Routes>
          {/* Home Page Route */}
          <Route
            path="/"
            element={
              <div className="home-container">
                <h1 className="home-heading">Check Who Isn't Following You Back on Instagram</h1>
                <p className="home-description">
                  Tired of following accounts that don't return the follow? 
                  Upload your followers and following data (just one file) 
                  to quickly find out who’s not following you back on Instagram. 
                  Take control of your account and clean up your following list!
                </p>
                <Link to="/check-unfollower" className="upload-btn">Let's Start</Link>
              </div>
            }
          />
          {/* CheckUnfollower Page Route */}
          <Route path="/check-unfollower" element={<CheckUnfollower />} />
          {/* Ok Page Route */}
          <Route path="/ok" element={<Ok />} />
          {/* Instructions Page Route */}
          <Route path="/instructions" element={<Instructions />} />
          {/* Contact Page Route */}
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
