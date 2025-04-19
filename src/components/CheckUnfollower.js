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
      const connectionsFolder = unzipped.folder('connections/followers_and_following');
      if (!connectionsFolder) {
        setError('The folder "connections/followers_and_following" is missing.');
        setIsLoading(false);
        return;
      }

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

      const nonFollowersList = following.filter(user => !followers.includes(user));
      setNonFollowers(nonFollowersList);
    } catch (err) {
      console.error(err);
      setError('There was an issue reading the file. Make sure it follows the Instagram ZIP format.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResult = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Users Not Following You Back:', 10, 20);

    nonFollowers.forEach((username, index) => {
      const y = 30 + (index % 28) * 10;
      if (index !== 0 && index % 28 === 0) doc.addPage();
      doc.text(`${index + 1}. ${username}`, 10, y);
    });

    doc.save('non-followers-list.pdf');
  };

  return (
    <div className="file-upload-container">
      <h2>Find Out Who Isn’t Following You Back</h2>
      <p className="sub-heading">Upload your Instagram ZIP file to see which accounts don't follow you back.</p>

      <div className="upload-section">
        <label htmlFor="file-upload" className="custom-upload-btn">Choose ZIP File</label>
        <input id="file-upload" type="file" accept=".zip" onChange={handleFileUpload} className="upload-input-hidden" />
        {isLoading && <p className="loading-spinner">Processing... Please wait.</p>}
        {error && <p className="error-message">{error}</p>}
      </div>

      {nonFollowers.length > 0 && (
        <div className="result-section">
          <h3>Users Not Following You Back ({nonFollowers.length})</h3>
          <ul className="non-followers-list">
            {nonFollowers.map((user, index) => (
              <li key={index}>
                <a href={`https://instagram.com/${user}`} target="_blank" rel="noopener noreferrer" className="no-underline">
                  {index + 1}. {user}
                </a>
              </li>
            ))}
          </ul>
          <button className="download-btn" onClick={downloadResult}>
            Download as PDF
          </button>
        </div>
      )}

      <div className="buttons-row">
        <button className="instructions-btn" onClick={() => navigate('/instructions')}>
          How to Get ZIP File
        </button>
        <button className="pending-requests-btn" onClick={() => navigate('/ok')}>
          Check Pending Requests
        </button>
      </div>
    </div>
  );
};

export default CheckUnfollower;
