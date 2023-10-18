// Navigation.js (React component)
import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {
  Button
} from "reactstrap";
import '../App.css'; // Import the CSS file

function Navigation() {
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();

  const logoutWithRedirect = () =>
  logout({
      logoutParams: {
        returnTo: window.location.origin,
      }
  });

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
          <li className='nav-item'>
          <Button
                    id="qsLoginBtn"
                    color="primary"
                    className="btn-margin"
                    onClick={() => loginWithRedirect()}
                  >
                    Login
                  </Button>
          </li>
          <li>
          <Button
                    id="qsLogoutBtn"
                    color="primary"
                    className="btn-margin"
                    onClick={() => logoutWithRedirect()}
                  >
                    Logout
                  </Button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
