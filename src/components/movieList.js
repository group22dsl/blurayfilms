// src/components/MovieDetail.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import Navigation from './navigation';
import { Container, Typography, Button, Grid, Card, CardMedia, CardContent } from '@mui/material';

function MovieList(props) {

    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [movieTypeText, setMovieTypeText] = useState('Lastest movies');
    const [noResultText, setNoResultText] = useState(null);

    const loadMoreHandler = async () => {
        setPage((prev) => prev + 1);
    }

    const handleSearch = async () => {
        setMovieTypeText(`Search results for "${query}"`);
        try {
        const { data: movieList } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/searchMovieByKey?key=${query}`);
        if(movieList && movieList.message) {
            const moviesList = movieList.message.filter((item) => item.vote_count > 5);
            if(moviesList.length === 0) {
                setNoResultText(`Sorry we cannot find movies for "${query}". But you will like these movies.`)
            } else {
                setNoResultText(null);
                setMovies(moviesList);
            }
        }
        } catch (error) {
        console.error("Error fetching movies:", error);
        }
    };

    useEffect(() => {
        if (props.type === 'now_playing'){
            setMovieTypeText('Now playing movies');
        } else if (props.type === 'popular'){
            setMovieTypeText('Popular movies');
        } else if (props.type === 'top_rated'){
            setMovieTypeText('Top rated movies');
        } else if (props.type === 'upcoming'){
            setMovieTypeText('Upcoming movies');
        } else {
            setMovieTypeText('Latest movies');
        }
    }, [props.type]);

    useEffect(() => {
        const getPopularMovies = async () => {
            const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/getMoviesListByType?searchType=${props.type}&page=${page}`);
            if(data.message) {
                const movieList = data.message.results.filter((item) => item.vote_count > 5);
                const concatMovieList = movies.concat(movieList);
                setNoResultText(null);
                setMovies(concatMovieList);
            }
        }
        getPopularMovies();
    }, [page]);

    return (
        <>
        <Navigation/>
        <div className="App">
            <Typography variant="h2" gutterBottom className='home-title'>
                Download Movies, Subtitles & Explore Movies!
            </Typography>
            <Typography variant="h6" paragraph className='home-subtitle'>
                Search movies from our <span className='movie-count'>118,254</span> movies database. Download movie & subtitle for <span className='movie-count'>FREE</span>. Enjoy!
            </Typography>
            <div className="search-bar">
                <input 
                value={query} 
                onChange={e => setQuery(e.target.value)} 
                placeholder="Search for any movie..." 
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            {/* <div style={{ marginTop: '100px', textAlign: 'center' }}>
                <Typography variant="h2" gutterBottom>
                Welcome to Movie Paradise
                </Typography>
                <Typography variant="h6" color="textSecondary" paragraph>
                Your ultimate destination for downloading the latest movies!
                </Typography>
                <Button variant="contained" color="primary" size="large">
                Get Started
                </Button>
            </div> */}
            <h2 className='movies-type-text'>{movieTypeText}</h2>
            {noResultText?  <p className='movies-no-results-text'>{noResultText}</p> : null}
            <div className="movies-list">
                {movies.map(movie => (
                <Link to={`/movie/${movie.id}/${movie.title}`} key={movie.id} className="movie">
                    <img 
                    src={`${process.env.REACT_APP_TMDB_IMAGE_URL}/w500${movie.poster_path}`} 
                    alt={movie.title}
                    />
                    <div>
                    {movie.title} ({movie.release_date.split('-')[0]})<br/><br/>
                    <span>IMDB: <b>{movie.vote_average.toFixed(1)}/10</b></span>
                    </div>
                </Link>
                ))}
            </div>
            {query === '' ? <button onClick={loadMoreHandler} className="load-more-button">Load more...</button> : ''}
        </div>
        </>
    );
}

export default MovieList;
