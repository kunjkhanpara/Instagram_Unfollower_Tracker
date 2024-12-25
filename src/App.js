// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Correct imports for v6
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
