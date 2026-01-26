import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p>If you have any questions or need assistance, feel free to reach out to us:</p>
      <ul>
        <li>Email: <a href="mailto:kunjwhatsapp@gmail.com">kunjwhatsapp@gmail.com</a></li>
        <li>Support available: 9 AM - 6 PM (Monday to Friday)</li>
        <li>For urgent queries, please expect a response within 24 hours.</li>
      </ul>
      <p>We value your feedback and are here to help you with any concerns.</p>
    </div>
  );
};

export default Contact;
