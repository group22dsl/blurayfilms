import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieDetail from './components/movieDetail';
import './App.css';
import MovieList from './components/movieList';
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";

const App = () => {
  const { isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return false;
  }

  return (
    <Router history={history}>
      <Routes>
        <Route path="/" element={<MovieList type=''/>} />
        <Route path="/now-playing" element={<MovieList type='now_playing'/>} />
        <Route path="/popular" element={<MovieList type='popular'/>} />
        <Route path="/top-rated" element={<MovieList type='top_rated'/>} />
        <Route path="/upcoming" element={<MovieList type='upcoming'/>} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
