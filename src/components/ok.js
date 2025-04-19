import React, { useState } from 'react';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';
import './ok.css';

const PendingRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      const folder = unzipped.folder('connections/followers_and_following');
      if (!folder) {
        setError('Folder "connections/followers_and_following" not found.');
        setIsLoading(false);
        return;
      }

      const pendingFile = folder.file('pending_follow_requests.json');
      if (pendingFile) {
        const content = await pendingFile.async('string');
        const jsonData = JSON.parse(content);
        requests = jsonData.relationships_follow_requests_sent.flatMap(item =>
          item.string_list_data.map(inner => inner.value.toLowerCase())
        );
      } else {
        setError('File "pending_follow_requests.json" not found.');
        setIsLoading(false);
        return;
      }

      setPendingRequests(requests);
      setError(null);
    } catch (err) {
      setError('Error reading ZIP file.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResult = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Pending Requests List', 10, 20);
    doc.setFontSize(12);
    pendingRequests.forEach((user, i) => {
      const y = 30 + (i % 28) * 10;
      if (i > 0 && i % 28 === 0) doc.addPage();
      doc.text(`${i + 1}. ${user}`, 10, y);
    });
    doc.save('pending-requests.pdf');
  };

  return (
    <div className="main-wrapper">
      <div className="file-upload-container">
        <h2>Pending Follow Requests</h2>
        <p className="description">
          Upload your Instagram ZIP file to check all pending follow requests you’ve sent.
        </p>

        <div className="upload-section">
          <label htmlFor="file-upload" className="custom-upload-btn">Upload ZIP File</label>
          <input id="file-upload" type="file" accept=".zip" onChange={handleFileUpload} className="upload-input-hidden" />
          {isLoading && <p className="loading-spinner">Processing file...</p>}
          {error && <p className="error-message">{error}</p>}
        </div>

        {pendingRequests.length > 0 && (
          <div className="result-section">
            <h3>{pendingRequests.length} Pending Request(s) Found</h3>
            <ul className="pending-requests-list">
              {pendingRequests.map((user, i) => (
                <li key={i}>
                  <a href={`https://instagram.com/${user}`} target="_blank" rel="noopener noreferrer">
                    {i + 1}. {user}
                  </a>
                </li>
              ))}
            </ul>
            <button className="download-btn" onClick={downloadResult}>Download as PDF</button>
          </div>
        )}

        <button className="instructions-btn" onClick={() => navigate('/instructions')}>How to Get ZIP File</button>
        <button className="back-btn" onClick={() => navigate('/check-unfollower')}>Back</button>
      </div>
    </div>
  );
};

export default PendingRequests;
