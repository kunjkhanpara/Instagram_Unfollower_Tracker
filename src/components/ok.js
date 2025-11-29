import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import "./ok.css";

const PendingRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 🔥 Internal storage (3-minute expiry)
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

  // Restore if <3 minutes
  useEffect(() => {
    const saved = loadTempData("pendingRequests");
    if (saved) setPendingRequests(saved);
  }, []);

  const handleFileUpload = async (e) => {
    setIsLoading(true);
    setError(null);

    const file = e.target.files[0];
    if (!file) {
      setError("Please upload a valid ZIP file.");
      setIsLoading(false);
      return;
    }

    const zip = new JSZip();
    try {
      const unzipped = await zip.loadAsync(file);

      const folder = unzipped.folder("connections/followers_and_following");
      if (!folder) {
        setError('Folder "connections/followers_and_following" not found.');
        setIsLoading(false);
        return;
      }

      const pendingFile = folder.file("pending_follow_requests.json");
      if (!pendingFile) {
        setError('File "pending_follow_requests.json" not found.');
        setIsLoading(false);
        return;
      }

      const content = await pendingFile.async("string");
      const jsonData = JSON.parse(content);

      const result = jsonData.relationships_follow_requests_sent.flatMap(item =>
        item.string_list_data.map(inner => inner.value.toLowerCase())
      );

      // Save for 3 minutes
      saveTempData("pendingRequests", result);

      setPendingRequests(result);
    } catch {
      setError("Error reading ZIP file.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResult = () => {
    const doc = new jsPDF();
    doc.text("Pending Requests List", 10, 20);

    pendingRequests.forEach((user, i) => {
      const y = 30 + (i % 28) * 10;
      if (i > 0 && i % 28 === 0) doc.addPage();
      doc.text(`${i + 1}. ${user}`, 10, y);
    });

    doc.save("pending-requests.pdf");
  };

  return (
    <div className="main-wrapper fade-in">
      <div className="file-upload-container slide-up">
        <h2>📤 Pending Follow Requests</h2>

        <p className="description">
          Upload your Instagram ZIP file to check all pending follow requests.
        </p>

        <div className="upload-section">
          <label htmlFor="file-upload" className="custom-upload-btn pulse">
            Upload ZIP File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".zip"
            onChange={handleFileUpload}
            className="upload-input-hidden"
          />

          {isLoading && <p className="loading-spinner">Processing file...</p>}
          {error && <p className="error-message">{error}</p>}
        </div>

        {pendingRequests.length > 0 && (
          <div className="result-section fade-in">
            <h3>{pendingRequests.length} Pending Request(s) Found</h3>

            <ul className="pending-requests-list">
              {pendingRequests.map((user, i) => (
                <li key={i}>
                  <a
                    href={`https://instagram.com/${user}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {i + 1}. {user}
                  </a>
                </li>
              ))}
            </ul>

            <button className="download-btn bounce" onClick={downloadResult}>
              📄 Download as PDF
            </button>
          </div>
        )}

        <button className="instructions-btn" onClick={() => navigate("/instructions")}>
          ❓ How to Get ZIP File
        </button>

        <button className="back-btn" onClick={() => navigate("/check-unfollower")}>
          🔙 Back
        </button>
      </div>
    </div>
  );
};

export default PendingRequests;
