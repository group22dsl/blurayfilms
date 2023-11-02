// src/components/MovieDetail.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import Navigation from './navigation';

function MovieList(props) {

    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);

    const loadMoreHandler = async () => {
        setPage((prev) => prev + 1);
    }

    const handleSearch = async () => {
        try {
        const { data: movieList } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/searchMovieByKey?key=${query}`);
        if(movieList && movieList.message) {
            setMovies(movieList.message.filter((item) => item.vote_count > 5));
        }
        } catch (error) {
        console.error("Error fetching movies:", error);
        }
    };

    useEffect(() => {
        const getPopularMovies = async () => {
            const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/getMoviesListByType?searchType=${props.type}&page=${page}`);
            if(data.message) {
                const movieList = data.message.results.filter((item) => item.vote_count > 5);
                const concatMovieList = movies.concat(movieList);
                setMovies(concatMovieList);
            }
        }
        getPopularMovies();
    }, [page]);

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
                <Link to={`/movie/${movie.id}/${movie.title}`} key={movie.id} className="movie">
                    <img 
                    src={`${process.env.REACT_APP_TMDB_IMAGE_URL}/w500${movie.poster_path}`} 
                    alt={movie.title}
                    />
                    <div>
                    {movie.title} ({movie.release_date.split('-')[0]})<br/><br/>
                    <span>IMDB: {movie.vote_average.toFixed(1)}/10</span>
                    </div>
                </Link>
                ))}
            </div>
            {query === '' ? <button onClick={loadMoreHandler} className="load-more-button">Load more</button> : ''}
        </div>
        </>
    );
}

export default MovieList;
