import React, { useState } from "react";
import JSZip from "jszip";
import { useNavigate } from "react-router-dom";
import "./Pending.css";

const Pending = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const isMobile =
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const getProfileLink = (username) =>
    isMobile
      ? `instagram://user?username=${username}`
      : `https://www.instagram.com/${username}`;

  const handleFileUpload = async (e) => {
    setIsLoading(true);
    setError("");
    setPendingRequests([]);

    try {
      const file = e.target.files[0];

      if (!file) {
        setError("Please upload a ZIP file.");
        return;
      }

      const zip = await JSZip.loadAsync(file);

      let pendingFile = null;

      Object.keys(zip.files).forEach((fileName) => {
        if (
          fileName.includes("pending_follow_requests") &&
          fileName.endsWith(".json")
        ) {
          pendingFile = zip.files[fileName];
        }
      });

      if (!pendingFile) {
        setError("pending_follow_requests.json not found.");
        return;
      }

      const content = await pendingFile.async("string");
      const jsonData = JSON.parse(content);

      let users = [];

      // NEW Instagram format
      if (Array.isArray(jsonData)) {
        users = jsonData
          .map((item) =>
            item.label_values?.find(
              (v) => v.label === "Username"
            )?.value
          )
          .filter(Boolean)
          .map((u) => u.toLowerCase());
      }

      // OLD Instagram format
      else if (
        jsonData.relationships_follow_requests_sent
      ) {
        users =
          jsonData.relationships_follow_requests_sent.flatMap(
            (item) =>
              item.string_list_data.map((i) =>
                i.value.toLowerCase()
              )
          );
      }

      setPendingRequests([...new Set(users)]);
    } catch (err) {
      console.error(err);
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
          Upload your Instagram ZIP file to see pending requests.
        </p>

        <label className="upload-button">
          Upload ZIP File
          <input
            type="file"
            hidden
            accept=".zip"
            onChange={handleFileUpload}
          />
        </label>

        {isLoading && (
          <p className="info-text">Processing...</p>
        )}

        {error && (
          <p className="error-text">{error}</p>
        )}

        {pendingRequests.length > 0 && (
          <div className="results-box">
            <h3>
              Pending Requests ({pendingRequests.length})
            </h3>

            <ul className="user-list">
              {pendingRequests.map((user, index) => (
                <li key={index}>
                  <a
                    href={getProfileLink(user)}
                    target={isMobile ? "_self" : "_blank"}
                    rel="noreferrer"
                  >
                    {index + 1}. {user}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="nav-buttons">
          <button
            onClick={() =>
              navigate("/check-unfollower")
            }
          >
            Unfollowers
          </button>

          <button
            onClick={() =>
              navigate("/instructions")
            }
          >
            Instructions
          </button>

          <button
            onClick={() =>
              navigate("/contact")
            }
          >
            Contact
          </button>

          <button onClick={() => navigate("/")}>
            Home
          </button>
        </div>
      </main>

      <footer className="main-footer">
        <p>© 2026 Instagram Unfollower Tracker</p>
      </footer>
    </div>
  );
};

export default Pending;