import React, { useState } from 'react';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';
import './CheckUnfollower.css';

const CheckUnfollower = () => {
  const [nonFollowers, setNonFollowers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = async (e) => {
    setIsLoading(true);
    setError(null); // Reset error state
    const file = e.target.files[0];
    if (!file) {
      setError('Please upload a valid ZIP file.');
      setIsLoading(false);
      return;
    }

    const zip = new JSZip();
    try {
      const unzipped = await zip.loadAsync(file);
      const connectionsFolder = unzipped.folder('connections/followers_and_following');
      if (!connectionsFolder) {
        setError('The folder "connections/followers_and_following" is missing in the ZIP file.');
        setIsLoading(false);
        return;
      }

      // Load followers
      const followersFile = connectionsFolder.file('followers_1.json');
      if (!followersFile) {
        setError('The file "followers_1.json" is missing.');
        setIsLoading(false);
        return;
      }
      const followersContent = await followersFile.async('string');
      const followersData = JSON.parse(followersContent);
      const followers = followersData.flatMap(item =>
        item.string_list_data.map(innerItem => innerItem.value.toLowerCase())
      );

      // Load following
      const followingFile = connectionsFolder.file('following.json');
      if (!followingFile) {
        setError('The file "following.json" is missing.');
        setIsLoading(false);
        return;
      }
      const followingContent = await followingFile.async('string');
      const followingData = JSON.parse(followingContent);
      const following = followingData.relationships_following.map(item =>
        item.string_list_data[0].value.toLowerCase()
      );

      // Find non-followers
      const nonFollowersList = following.filter(user => !followers.includes(user));
      setNonFollowers(nonFollowersList);
    } catch (err) {
      setError('An error occurred while processing the ZIP file. Please ensure the file is in the correct format.');
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
      const yPosition = 30 + (index * 10) % 280; // Add a new page after filling current
      const xPosition = 10;
      if (index > 0 && index % 28 === 0) doc.addPage();
      doc.text(text, xPosition, yPosition);
    });

    doc.save('non-followers-list.pdf');
  };

  const navigateToInstructions = () => {
    navigate('/instructions');
  };

  const navigateToPendingRequests = () => {
    navigate('/ok');
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

      <button className="instructions-btn" onClick={navigateToInstructions}>
        How to Find the ZIP File
      </button>
      <button className="pending-requests-btn" onClick={navigateToPendingRequests}>
        Check Pending Requests
      </button>
    </div>
  );
};

export default CheckUnfollower;
