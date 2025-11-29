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

  // 🔹 Internal Storage Functions
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

  // 🔹 Load previous live data within 3 minutes
  useEffect(() => {
    const saved = loadTempData("pendingRequests");
    if (saved) setPendingRequests(saved);
  }, []);

  const handleFileUpload = async (e) => {
    setIsLoading(true);
    setError(null);

    const file = e.target.files[0];
    if (!file) {
      setError("Please upload ZIP file");
      setIsLoading(false);
      return;
    }

    try {
      const zip = new JSZip();
      const unzipped = await zip.loadAsync(file);

      const folder = unzipped.folder("connections/followers_and_following");
      if (!folder) {
        setError("Folder not found");
        setIsLoading(false);
        return;
      }

      const pendingFile = folder.file("pending_follow_requests.json");
      if (!pendingFile) {
        setError("pending_follow_requests.json missing");
        setIsLoading(false);
        return;
      }

      const content = await pendingFile.async("string");
      const json = JSON.parse(content);

      const result = json.relationships_follow_requests_sent.flatMap((item) =>
        item.string_list_data.map((inner) => inner.value.toLowerCase())
      );

      // 🔹 SAVE for 3 minutes
      saveTempData("pendingRequests", result);

      setPendingRequests(result);
    } catch (err) {
      console.error(err);
      setError("Error processing ZIP file");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResult = () => {
    const doc = new jsPDF();
    doc.text("Pending Requests", 10, 20);

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
        <h2>Pending Follow Requests</h2>

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

        {isLoading && <p>Processing...</p>}
        {error && <p className="error-message">{error}</p>}

        {pendingRequests.length > 0 && (
          <div className="result-section fade-in">
            <h3>{pendingRequests.length} Request(s)</h3>

            <ul>
              {pendingRequests.map((user, i) => (
                <li key={i}>
                  <a href={`https://instagram.com/${user}`} target="_blank">
                    {i + 1}. {user}
                  </a>
                </li>
              ))}
            </ul>

            <button onClick={downloadResult}>Download PDF</button>
          </div>
        )}

        <button onClick={() => navigate("/instructions")}>How to Get ZIP File</button>
        <button onClick={() => navigate("/check-unfollower")}>Back</button>
      </div>
    </div>
  );
};

export default PendingRequests;
