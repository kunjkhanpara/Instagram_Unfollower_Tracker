import React, { useState } from 'react';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import './ok.css';

const PendingRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (e) => {
    setIsLoading(true);
    const file = e.target.files[0];
    if (!file) {
      setError('Please upload a valid ZIP file.');
      setIsLoading(false);
      return;
    }

    const zip = new JSZip();
    try {
      const unzipped = await zip.loadAsync(file);
      let requests = [];

      const connectionsFolder = unzipped.folder('connections/followers_and_following');
      if (!connectionsFolder) {
        setError('The folder "connections/followers_and_following" is missing.');
        setIsLoading(false);
        return;
      }

      const pendingRequestsFile = connectionsFolder.file('pending_follow_requests.json');
      if (pendingRequestsFile) {
        const content = await pendingRequestsFile.async('string');
        const jsonData = JSON.parse(content);
        requests = jsonData.relationships_follow_requests_sent.flatMap(item =>
          item.string_list_data.map(innerItem => innerItem.value.toLowerCase())
        );
      } else {
        setError('Missing "pending_follow_requests.json" file.');
        setIsLoading(false);
        return;
      }

      setPendingRequests(requests);
      setError(null);
    } catch (err) {
      setError('Error processing the ZIP file.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResult = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Pending Requests List', 10, 20);
    doc.setFontSize(12);

    pendingRequests.forEach((username, index) => {
      const text = `${index + 1}. ${username}`;
      const yPosition = 30 + (index * 10) % 280; // Add a new page after filling current
      const xPosition = 10;
      if (index > 0 && index % 28 === 0) doc.addPage();
      doc.text(text, xPosition, yPosition);
    });

    doc.save('pending-requests-list.pdf');
  };

  return (
    <div className="file-upload-container">
      <h2>Pending Request Accounts</h2>
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

      {pendingRequests.length > 0 && (
        <div className="result-section">
          <h3>Pending Requests ({pendingRequests.length})</h3>
          <ul className="pending-requests-list">
            {pendingRequests.map((user, index) => (
              <li key={index}>
                <a href={`https://instagram.com/${user}`} target="_blank" rel="noopener noreferrer" className="no-underline">
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

      <button className="instructions-btn" onClick={() => window.location.href = '/instructions'}>
        How to Find the ZIP File
      </button>

      <button className="back-btn" onClick={() => window.location.href = '/check-unfollower'}>
        Go Back to Check Pending Requests
      </button>
    </div>
  );
};

export default PendingRequests;
