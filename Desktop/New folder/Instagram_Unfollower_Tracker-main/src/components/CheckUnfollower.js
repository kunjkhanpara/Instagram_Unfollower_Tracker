import React, { useState } from "react";
import JSZip from "jszip";
import { useNavigate } from "react-router-dom";
import "./CheckUnfollower.css";

const CheckUnfollower = () => {
  const [nonFollowers, setNonFollowers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const openInstagramProfile = (username) => {
    const appLink = `instagram://user?username=${username}`;
    const webLink = `https://www.instagram.com/${username}`;

    // Try opening Instagram app
    window.location.href = appLink;

    // Fallback to browser after 1 second if app not opened
    setTimeout(() => {
      window.open(webLink, "_blank");
    }, 1000);
  };

  const handleFileUpload = async (e) => {
    setIsLoading(true);
    setError("");
    setNonFollowers([]);

    const file = e.target.files[0];
    if (!file) {
      setError("Please upload a valid ZIP file.");
      setIsLoading(false);
      return;
    }

    try {
      const zip = await JSZip.loadAsync(file);
      const connectionsFolder = zip.folder("connections/followers_and_following");

      if (!connectionsFolder) {
        setError('Folder "connections/followers_and_following" is missing.');
        setIsLoading(false);
        return;
      }

      const followersFile = connectionsFolder.file("followers_1.json");
      if (!followersFile) {
        setError("followers_1.json is missing.");
        setIsLoading(false);
        return;
      }

      const followersText = await followersFile.async("string");
      const followersJson = JSON.parse(followersText);

      const followers = followersJson
        .map((item) => item.string_list_data?.[0]?.value)
        .filter(Boolean)
        .map((u) => u.toLowerCase());

      const followingFile = connectionsFolder.file("following.json");
      if (!followingFile) {
        setError("following.json is missing.");
        setIsLoading(false);
        return;
      }

      const followingText = await followingFile.async("string");
      const followingJson = JSON.parse(followingText);

      const following = followingJson.relationships_following
        .map((item) => item.title)
        .filter(Boolean)
        .map((u) => u.toLowerCase());

      const nonFollowersList = following.filter(
        (user) => !followers.includes(user)
      );

      setNonFollowers(nonFollowersList);
    } catch (err) {
      setError("Error processing ZIP file. Please upload original Instagram ZIP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-bg">
      <header className="main-header">
        <h1>Instagram Unfollower Tracker</h1>
      </header>

      <main className="card-container">
        <h2>Who Isn’t Following You Back</h2>
        <p className="page-description">
          Upload your Instagram ZIP file and instantly see which accounts you
          follow that are not following you back.
        </p>

        <label className="upload-button">
          Upload ZIP File
          <input type="file" accept=".zip" hidden onChange={handleFileUpload} />
        </label>

        {isLoading && <p className="info-text">Processing... Please wait.</p>}
        {error && <p className="error-text">{error}</p>}

        {nonFollowers.length > 0 && (
          <div className="results-box">
            <h3>Non-Followers ({nonFollowers.length})</h3>
            <ul className="user-list">
              {nonFollowers.map((user, index) => (
                <li key={index}>
                  <button
                    className="profile-link-btn"
                    onClick={() => openInstagramProfile(user)}
                  >
                    {index + 1}. {user}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="nav-buttons">
          <button onClick={() => navigate("/instructions")}>
            How to Download ZIP
          </button>
          <button onClick={() => navigate("/pending")}>
            Check Pending Requests
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

export default CheckUnfollower;
