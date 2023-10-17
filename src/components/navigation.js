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
            <a href="/">Now playing</a>
          </li>
          <li className="nav-item">
            <a href="/about">Popular</a>
          </li>
          <li className="nav-item">
            <a href="/services">Top Rated</a>
          </li>
          <li className="nav-item">
            <a href="/contact">Upcoming</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
