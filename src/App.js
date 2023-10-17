import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieDetail from './components/movieDetail';
import './App.css';
import MovieList from './components/movieList';


function App() {
  return (
    <Router>
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
}

export default App;
