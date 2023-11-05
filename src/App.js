import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieDetail from './components/movieDetail';
import './App.css';
import MovieList from './components/movieList';
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";

const App = () => {
  const { error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  return (
    <Router history={history}>
      <Routes>
        <Route path="/" element={<MovieList type=''/>} />
        <Route path="/now-playing-movies" element={<MovieList type='now_playing'/>} />
        <Route path="/popular-movies" element={<MovieList type='popular'/>} />
        <Route path="/top-rated-movies" element={<MovieList type='top_rated'/>} />
        <Route path="/upcoming-movies" element={<MovieList type='upcoming'/>} />
        <Route path="/movie/:id/:title" element={<MovieDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
