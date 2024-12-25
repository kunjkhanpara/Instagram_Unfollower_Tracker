// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import Link for navigation
import './App.css';
import FileUpload from './components/FileUpload';
import Instructions from './components/Instructions'; // Assuming you've created this component

function App() {
  return (
    <Router>
      <div className="container">
        <div className="app-header">
          <h1>Followers & Following Comparison</h1>
          <p>Upload a ZIP file containing your followers and following data to find out who doesn't follow you back!</p>
          
          {/* Button to Start */}
          <Link to="/" className="start-button">
            <button>Start</button>
          </Link>
        </div>

        <Routes>
          <Route path="/" element={<FileUpload />} />
          <Route path="/instructions" element={<Instructions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
