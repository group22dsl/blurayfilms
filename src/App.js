import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import MovieDetail from './components/movieDetail';
import './App.css';
import Navigation from './components/navigation';

const TMDB_API_KEY = 'c70795663059c39a09b30a48cc301d36';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function MoviesList() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${query}`
      );
      const data = await response.json();
      setMovies(data.results.filter((item) => item.vote_count > 5));
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    const getPopularMovies = async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/gePopularMovies`);
        if(data.message) {
          setMovies(data.message.results.filter((item) => item.vote_count > 5));
        }
    }
    getPopularMovies();
}, []);

  return (
    <>
    <Navigation/>
    <div className="App">
      <div className="search-bar">
        <input 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
          placeholder="Search for a movie..." 
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="movies-list">
        {movies.map(movie => (
          <Link to={`/movie/${movie.id}`} key={movie.id} className="movie">
            <img 
              src={`${process.env.REACT_APP_TMDB_IMAGE_URL}/w500${movie.poster_path}`} 
              alt={movie.title} 
            />
            <div>
              {movie.title}<br/><br/>
              <span>IMDB: {movie.vote_average.toFixed(1)}/10</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MoviesList />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
