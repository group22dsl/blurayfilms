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
            <a href="/now-playing">Now playing</a>
          </li>
          <li className="nav-item">
            <a href="/popular">Popular</a>
          </li>
          <li className="nav-item">
            <a href="/top-rated">Top Rated</a>
          </li>
          <li className="nav-item">
            <a href="/upcoming">Upcoming</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
