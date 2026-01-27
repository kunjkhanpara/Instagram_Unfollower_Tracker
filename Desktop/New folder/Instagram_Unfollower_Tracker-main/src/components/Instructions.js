import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Instructions.css";
import tutorialVideo from "../assets/instructions-video.mp4";

const Instructions = () => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="page-bg">
      <header className="main-header">
        <h1>Download Instagram ZIP File</h1>
      </header>

      <main className="card-container">
        <h2>How to Get Your Instagram ZIP File</h2>
        <p><strong>Follow these steps carefully:</strong></p>

        <ol className="instruction-list">
          <li>Open your Instagram app and go to <strong>Settings</strong>.</li>
          <li>Search for <strong>"Download your information"</strong> in Settings.</li>
          <li>You will be redirected to the <strong>Create Export</strong> page. Click the <strong>Create Export</strong> button.</li>
          <li>Select <strong>Export to device</strong>.</li>
          <li>Click on <strong>Customize information</strong>.</li>
          <li>Uncheck (remove tick) from all options.</li>
          <li>Only select <strong>Followers and Following</strong> inside the <strong>Connections</strong> section.</li>
          <li>Click <strong>Save</strong>.</li>
          <li>Set <strong>Date Range</strong> to <strong>All time</strong>.</li>
          <li>Set <strong>Format</strong> to <strong>JSON</strong> (not HTML).</li>
          <li>Set <strong>Media Quality</strong> to <strong>High</strong>.</li>
          <li>Click the <strong>Start Export</strong> button.</li>
          <li>Wait for about <strong>5 to 10 minutes</strong>.</li>
          <li>Refresh the same page and download the generated <strong>ZIP file</strong>.</li>
        </ol>

        {/* BUTTON TO SHOW / HIDE VIDEO */}
        <div className="video-toggle-area">
          {!showVideo ? (
            <button
              className="video-toggle-btn"
              onClick={() => setShowVideo(true)}
            >
              ▶ Watch Video Tutorial
            </button>
          ) : (
            <button
              className="video-toggle-btn"
              onClick={() => setShowVideo(false)}
            >
              ✖ Hide Video
            </button>
          )}
        </div>

        {/* VIDEO SECTION */}
        {showVideo && (
          <div className="video-container">
            <video className="instruction-video" controls autoPlay>
              <source src={tutorialVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p className="video-caption">
              This video shows step-by-step how to download your Instagram ZIP file.
            </p>
          </div>
        )}

        <div className="nav-buttons">
          <button onClick={() => navigate("/check-unfollower")}>Upload ZIP</button>
          <button onClick={() => navigate("/pending")}>Pending Requests</button>
          <button onClick={() => navigate("/contact")}>Contact</button>
          <button onClick={() => navigate("/")}>Home</button>
        </div>
      </main>

      <footer className="main-footer">
        <p>© 2026 Instagram Unfollower Tracker</p>
      </footer>
    </div>
  );
};

export default Instructions;
