import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import CheckUnfollower from "./components/CheckUnfollower";
import Instructions from "./components/Instructions";
import Pending from "./components/Pending";
import Contact from "./components/Contact";

function App() {
  return (
    <Router basename="/Instagram_Unfollower_Tracker">
      <Routes>
        <Route
          path="/"
          element={
            <div className="home-bg">
              <div className="home-card">
                <h1>Instagram Unfollower Tracker</h1>
                <p>
                  Upload your Instagram ZIP file and find:
                  <br />• Who unfollowed you  
                  <br />• Who never followed you back  
                  <br />• Which requests are pending
                </p>
                <Link to="/check-unfollower" className="start-button">
                  Start Now
                </Link>
              </div>
            </div>
          }
        />
        <Route path="/check-unfollower" element={<CheckUnfollower />} />
        <Route path="/pending" element={<Pending />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
