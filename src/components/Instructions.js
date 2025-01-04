import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Instructions.css';

const Instructions = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/check-unfollower');
  };

  return (
    <div className="instructions-container">
      <h2><strong>How to Get Your Instagram ZIP File</strong></h2>
      <p className="intro-text"><strong>Follow these easy steps to download your Instagram data:</strong></p>
      <div className="steps-container">
        <ol className="steps-list">
          <li>Go to your Instagram profile and open the top-right menu.</li>
          <li>Select <strong>"Your Activity"</strong> and choose <strong>"Download Your Information"</strong>.</li>
          <li>Choose <strong>"Some of your information"</strong>, then select the <strong>"Followers and Following"</strong> option.</li>
          <li>Select <strong>"Download to device"</strong> and then click <strong>"Next"</strong>.</li>
          <li>Choose <strong>"All time"</strong> for the date range and click <strong>"Save"</strong>.</li>
          <li>Select <strong>"JSON"</strong> as the format and click <strong>"Create files"</strong>.</li>
          <li>You will receive an email from Instagram with a <strong>"Download Your Information"</strong> link.</li>
        </ol>
      </div>
      <h3><strong>Step 2: Download the ZIP</strong></h3>
      <p className="instruction-text"><strong>Once you receive the email, click on the "Download Your Information" link to get your ZIP file.</strong></p>
      <h3><strong>Step 3: Upload the ZIP</strong></h3>
      <p className="instruction-text"><strong>Upload the ZIP file here to check who doesn’t follow you back.</strong></p>
      <div className="navigation-buttons">
        <button className="go-to-upload-button" onClick={handleBackClick}><strong>Go to Upload File</strong></button>
      </div>
    </div>
  );
};

export default Instructions;
