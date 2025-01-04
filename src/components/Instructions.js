
// src/components/Instructions.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Instructions.css';

const Instructions = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    // Navigating to CheckUnfollower page
    navigate('/check-unfollower');
  };

  return (
    <div className="instructions-container">
      <h2>How to Get Your Instagram ZIP File</h2>
      <p className="intro-text">Follow these easy steps to download your Instagram data:</p>
      <div className="steps-container">
        <ol className="steps-list">
          <li>Go to your Instagram profile and open the top-right menu.</li>
          <li>Select "Your Activity" and choose "Download Your Information".</li>
          <li>Choose "Some of your information", then select the "Followers and Following" option.</li>
          <li>Select "Download to device" and then click "Next".</li>
          <li>Choose "All time" for the date range and click "Save".</li>
          <li>Select "JSON" as the format and click "Create files".</li>
          <li>You will receive an email from Instagram with a download link.</li>
        </ol>
      </div>
      <h3>Step 2: Download the ZIP</h3>
      <p className="instruction-text">Once you receive the email, click on the "Download Your Information" link to get your ZIP file.</p>
      <h3>Step 3: Upload the ZIP</h3>
      <p className="instruction-text">Upload the ZIP file here to check who doesn’t follow you back.</p>
      <div className="navigation-buttons">
        <button className="go-to-upload-button" onClick={handleBackClick}>Go to Upload File</button>
      </div>
    </div>
  );
};

export default Instructions;
   
