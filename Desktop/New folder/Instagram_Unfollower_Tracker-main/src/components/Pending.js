import React, { useState } from "react";
import JSZip from "jszip";
import { useNavigate } from "react-router-dom";
import "./Pending.css";

const Pending = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const openInstagramProfile = (username) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = `instagram://user?username=${username}`;
      setTimeout(() => {
        window.location.href = `https://instagram.com/${username}`;
      }, 1000);
    } else {
      window.open(`https://instagram.com/${username}`, "_blank");
    }
  };

  const handleFileUpload = async (e) => {
    setIsLoading(true);
    setError("");
    setPendingRequests([]);

    const file = e.target.files[0];
    if (!file) {
      setError("Please upload a ZIP file.");
      setIsLoading(false);
      return;
    }

    try {
      const zip = await JSZip.loadAsync(file);
      const folder = zip.folder("connections/followers_and_following");
      const fileData = folder.file("pending_follow_requests.json");

      const content = await fileData.async("string");
      const jsonData = JSON.parse(content);

      const users = jsonData.relationships_follow_requests_sent.flatMap(
        (item) =>
          item.string_list_data.map((i) => i.value.toLowerCase())
      );

      setPendingRequests(users);
    } catch {
      setError("Error processing ZIP file.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-bg">
      <header className="main-header">
        <h1>Pending Follow Requests</h1>
      </header>

      <main className="card-container">
        <p className="page-description">
          Upload your Instagram ZIP file to see which follow requests are still pending.
        </p>

        <label className="upload-button">
          Upload ZIP File
          <input type="file" hidden accept=".zip" onChange={handleFileUpload} />
        </label>

        {isLoading && <p className="info-text">Processing...</p>}
        {error && <p className="error-text">{error}</p>}

        {pendingRequests.length > 0 && (
          <div className="results-box">
            <h3>Pending Requests ({pendingRequests.length})</h3>
            <ul className="user-list">
              {pendingRequests.map((user, index) => (
                <li key={index}>
                  <button
                    onClick={() => openInstagramProfile(user)}
                    className="user-link"
                  >
                    {index + 1}. {user}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="nav-buttons">
          <button onClick={() => navigate("/check-unfollower")}>
            Unfollowers
          </button>
          <button onClick={() => navigate("/instructions")}>
            Instructions
          </button>
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

export default Pending;
