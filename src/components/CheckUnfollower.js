import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import "./CheckUnfollower.css";

const CheckUnfollower = () => {
  const [nonFollowers, setNonFollowers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Internal Storage Functions (3-minute expiry)
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

  // 🔹 Restore previous result if <3 minutes old
  useEffect(() => {
    const saved = loadTempData("nonFollowers");
    if (saved) setNonFollowers(saved);
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

    try {
      const zip = new JSZip();
      const unzipped = await zip.loadAsync(file);

      const followersFile = unzipped.file(/followers_1\.json$/i)[0];
      if (!followersFile) {
        setError('followers_1.json missing');
        setIsLoading(false);
        return;
      }

      const followersContent = await followersFile.async("string");
      const followersData = JSON.parse(followersContent);
      const followers = followersData.flatMap((item) =>
        item.string_list_data.map((inner) => inner.value.toLowerCase())
      );

      const followingFile = unzipped.file(/following\.json$/i)[0];
      if (!followingFile) {
        setError("following.json missing");
        setIsLoading(false);
        return;
      }

      const followingContent = await followingFile.async("string");
      const followingData = JSON.parse(followingContent);
      const following = followingData.relationships_following.map((item) =>
        (item.title || item.string_list_data[0].value).toLowerCase()
      );

      const result = following.filter((user) => !followers.includes(user));

      // 🔹 SAVE for 3 minutes
      saveTempData("nonFollowers", result);

      setNonFollowers(result);
    } catch (err) {
      console.error(err);
      setError("Error processing ZIP file.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResult = () => {
    const doc = new jsPDF();
    doc.text("Non-Followers List", 10, 20);

    nonFollowers.forEach((user, i) => {
      const y = 30 + (i % 28) * 10;
      if (i > 0 && i % 28 === 0) doc.addPage();
      doc.text(`${i + 1}. ${user}`, 10, y);
    });

    doc.save("non-followers-list.pdf");
  };

  return (
    <div className="file-upload-container">
      <h2>Check Who Isn't Following You Back</h2>

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

      {nonFollowers.length > 0 && (
        <div className="result-section">
          <h3>Non-Followers ({nonFollowers.length})</h3>

          <ul>
            {nonFollowers.map((user, i) => (
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

      <button onClick={() => navigate("/instructions")}>
        How to Find ZIP File
      </button>
      <button onClick={() => navigate("/ok")}>Check Pending Requests</button>
    </div>
  );
};

export default CheckUnfollower;
