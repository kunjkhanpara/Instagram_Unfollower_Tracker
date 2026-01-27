import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="page-bg">
      <header className="main-header">
        <h1>Contact Us</h1>
      </header>

      <main className="card-container">
        <p>Email: <a href="mailto:kunjwhatsapp@gmail.com">kunjwhatsapp@gmail.com</a></p>
        <p>Support available: Monday to Friday, 9AM to 6PM</p>
        <p>Response time: within 24 hours</p>

        <div className="nav-buttons">
          <button onClick={() => window.history.back()}>Go Back</button>
          <button onClick={() => window.location.href="/Instagram_Unfollower_Tracker/"}>Home</button>
        </div>
      </main>

      <footer className="main-footer">
        <p>© 2026 Instagram Unfollower Tracker</p>
      </footer>
    </div>
  );
};

export default Contact;
