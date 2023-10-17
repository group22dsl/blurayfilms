// Navigation.js (React component)
import React from 'react';
import '../App.css'; // Import the CSS file

function Navigation() {
  return (
    <nav className="navbar">
      <div className="container">
        <a href="/" className="logo">
          Blurayfilms
        </a>
        <ul className="nav-links">
          <li className="nav-item">
            <a href="/">Home</a>
          </li>
          <li className="nav-item">
            <a href="/about">About</a>
          </li>
          <li className="nav-item">
            <a href="/services">Services</a>
          </li>
          <li className="nav-item">
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
