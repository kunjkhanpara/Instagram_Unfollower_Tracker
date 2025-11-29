import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';
import './CheckUnfollower.css';

const CheckUnfollower = () => {
  const [nonFollowers, setNonFollowers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Internal Storage Functions (3-min expiry)
  const saveTempData = (key, value) => {
    const payload = {
      expiresAt: Date.now() + 3 * 60 * 1000,
      value,
    };
    localStorage.setItem(key, JSON.stringify(payload));
  };

  const loadTempData = (key) => {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const data = JSON.parse(item);
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return data.value;
  };

  // Load saved data (<3 min old)
  useEffect(() => {
    const saved = loadTempData("nonFollowers");
    if (saved) setNonFollowers(saved);
  }, []);

  const handleFileUpload = async (e) => {
    setIsLoading(true);
    setError(null);

    const file = e.target.files[0];
    if (!file) {
      setError('Please upload a valid ZIP file.');
      setIsLoading(false);
      return;
    }

    const zip = new JSZip();
    try {
      const unzipped = await zip.loadAsync(file);

      const followersFile = unzipped.file(/followers_1\.json$/i)[0];
      if (!followersFile) {
        setError('The file "followers_1.json" is missing.');
        setIsLoading(false);
        return;
      }
      const followersContent = await followersFile.async('string');
      const followersData = JSON.parse(followersContent);
      const followers = followersData.flatMap(item =>
        item.string_list_data.map(inner => inner.value.toLowerCase())
      );

      const followingFile = unzipped.file(/following\.json$/i)[0];
      if (!followingFile) {
        setError('The file "following.json" is missing.');
        setIsLoading(false);
        return;
      }
      const followingContent = await followingFile.async('string');
      const followingData = JSON.parse(followingContent);
      const following = followingData.relationships_following.map(item =>
        (item.title || item.string_list_data[0].value).toLowerCase()
      );

      const nonFollowersList = following.filter(user => !followers.includes(user));

      // 🔥 Save for 3 minutes
      saveTempData("nonFollowers", nonFollowersList);

      setNonFollowers(nonFollowersList);

    } catch (err) {
      setError('An error occurred while processing the ZIP file.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResult = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Non-Followers List', 10, 20);
    doc.setFontSize(12);

    nonFollowers.forEach((username, index) => {
      const text = `${index + 1}. ${username}`;
      const yPosition = 30 + (index * 10) % 280;
      if (index > 0 && index % 28 === 0) doc.addPage();
      doc.text(text, 10, yPosition);
    });

    doc.save('non-followers-list.pdf');
  };

  return (
    <div className="file-upload-container">
      <h2>Check Who Isn't Following You Back</h2>

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
                  className="no-underline"
                >
                  {index + 1}. {user}
                </a>
              </li>
            ))}
          </ul>
          <button className="download-btn" onClick={downloadResult}>
            Download List as PDF
          </button>
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
