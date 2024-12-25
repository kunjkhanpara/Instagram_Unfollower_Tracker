import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import './FileUpload.css';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
  const [error, setError] = useState(null);
  const [nonFollowers, setNonFollowers] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileUpload = async (e) => {
    setIsLoading(true);
    const file = e.target.files[0];
    if (!file) return;

    const zip = new JSZip();
    try {
      const unzipped = await zip.loadAsync(file);
      let followers = [];
      let following = [];

      const connectionsFolder = unzipped.folder('connections/followers_and_following');
      if (!connectionsFolder) {
        setError('The expected folder "connections/followers_and_following" is missing in the ZIP file.');
        setIsLoading(false);
        return;
      }

      const followersFile = connectionsFolder.file('followers_1.json');
      if (followersFile) {
        const content = await followersFile.async('string');
        const jsonData = JSON.parse(content);
        followers = jsonData.flatMap(item =>
          item.string_list_data.map(innerItem => innerItem.value.toLowerCase())
        );
      } else {
        setError('Missing "followers_1.json" in the ZIP file.');
        setIsLoading(false);
        return;
      }

      const followingFile = connectionsFolder.file('following.json');
      if (followingFile) {
        const content = await followingFile.async('string');
        const jsonData = JSON.parse(content);

        following = jsonData.relationships_following.flatMap(item =>
          item.string_list_data.map(innerItem => ({
            username: innerItem.value.toLowerCase(),
            profileUrl: innerItem.href,
          }))
        );
      } else {
        setError('Missing "following.json" in the ZIP file.');
        setIsLoading(false);
        return;
      }

      const nonFollowersList = following.filter(user =>
        !followers.includes(user.username)
      );

      setNonFollowers(nonFollowersList);
      setTotal(nonFollowersList.length);
      setError(null);
    } catch (err) {
      setError('Error unzipping or processing files.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResult = () => {
    const doc = new jsPDF();
    const margin = 10;
    const lineHeight = 10;
    const maxWidth = 180; // Adjust based on your needs
    let yOffset = 20;

    // Title
    doc.setFontSize(16);
    doc.text('Non-Followers List', margin, yOffset);
    yOffset += lineHeight * 2;

    // Iterate through the non-followers list and add them to the PDF
    doc.setFontSize(12);
    nonFollowers.forEach((user, index) => {
      const text = `${index + 1}. ${user.username}`;
      if (yOffset + lineHeight > doc.internal.pageSize.height - margin) {
        doc.addPage();
        yOffset = margin;
      }
      doc.text(text, margin, yOffset);
      yOffset += lineHeight;
    });

    // Save the document
    doc.save('non-followers-list.pdf');
  };

  return (
    <div className="file-upload-container">
      <div className="header">
        <h1>Find Who Is Not Following You Back</h1>
        <button
          className="instructions-btn"
          onClick={() => navigate('/instructions')}
        >
          How to Get Your Instagram ZIP File
        </button>
      </div>

      <div className="upload-section">
        <input
          type="file"
          accept=".zip"
          onChange={handleFileUpload}
          className="upload-input"
        />
        {isLoading && <p className="loading-spinner">Processing... Please wait.</p>}
        {error && <p className="error-message">{error}</p>}
      </div>

      {nonFollowers.length > 0 && (
        <div className="result-container">
          <h2>Non-Followers ({total})</h2>
          <div className="non-followers-list-container">
            <ul className="non-followers-list">
              {nonFollowers.map((user, index) => (
                <li key={index}>
                  <span className="list-number">{index + 1}</span>
                  <a
                    href={user.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-link"
                  >
                    {user.username}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <button className="download-btn" onClick={downloadResult}>
            Download Non-Followers List as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
