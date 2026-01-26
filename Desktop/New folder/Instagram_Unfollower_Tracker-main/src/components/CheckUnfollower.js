import React, { useState } from 'react';
import JSZip from 'jszip';
import { useNavigate } from 'react-router-dom';
import './CheckUnfollower.css';

const CheckUnfollower = () => {
  const [nonFollowers, setNonFollowers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = async (e) => {
    setIsLoading(true);
    setError(null);
    setNonFollowers([]);

    const file = e.target.files[0];
    if (!file) {
      setError('Please upload a valid ZIP file.');
      setIsLoading(false);
      return;
    }

    try {
      const zip = await JSZip.loadAsync(file);

      const connectionsFolder = zip.folder('connections/followers_and_following');
      if (!connectionsFolder) {
        setError('Folder "connections/followers_and_following" is missing.');
        setIsLoading(false);
        return;
      }

      // READ FOLLOWERS
      const followersFile = connectionsFolder.file('followers_1.json');
      if (!followersFile) {
        setError('followers_1.json is missing.');
        setIsLoading(false);
        return;
      }

      const followersText = await followersFile.async('string');
      const followersJson = JSON.parse(followersText);

      const followers = followersJson
        .map(item => item.string_list_data?.[0]?.value)
        .filter(Boolean)
        .map(u => u.toLowerCase());

      // READ FOLLOWING
      const followingFile = connectionsFolder.file('following.json');
      if (!followingFile) {
        setError('following.json is missing.');
        setIsLoading(false);
        return;
      }

      const followingText = await followingFile.async('string');
      const followingJson = JSON.parse(followingText);

      const following = followingJson.relationships_following
        .map(item => item.title)
        .filter(Boolean)
        .map(u => u.toLowerCase());

      // COMPARE
      const nonFollowersList = following.filter(user => !followers.includes(user));
      setNonFollowers(nonFollowersList);

    } catch (err) {
      console.error(err);
      setError('Error processing ZIP file. Please upload original Instagram ZIP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Who Isn’t Following You Back</h2>

      <div className="upload-section">
        <label htmlFor="file-upload" className="custom-upload-btn">
          Upload ZIP File
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".zip"
          onChange={handleFileUpload}
          className="upload-input-hidden"
        />

        {isLoading && <p className="loading-spinner">Processing... Please wait.</p>}
        {error && <p className="error-message">{error}</p>}
      </div>

      {nonFollowers.length > 0 && (
        <div className="result-section">
          <h3>Non-Followers ({nonFollowers.length})</h3>
          <ul className="non-followers-list">
            {nonFollowers.map((user, index) => (
              <li key={index}>
                <a
                  href={`https://instagram.com/${user}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {index + 1}. {user}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="instructions-btn" onClick={() => navigate('/instructions')}>
        How to Find the ZIP File
      </button>

      <button className="pending-requests-btn" onClick={() => navigate('/ok')}>
        Check Pending Requests
      </button>
    </div>
  );
};

export default CheckUnfollower;
