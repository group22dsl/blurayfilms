// src/components/MovieDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import langs from 'langs';
import '../App.css';
import Navigation from './navigation';

function MovieDetail() {

    const { id: movieId } = useParams();
    const [movie, setMovie] = useState({});
    const [languageName, setLanguageName] = useState();
    const [torrentLink, setTorrentLink] = useState();
    const [trailerKey, setTrailerKey] = useState();

    useEffect(() => {
        const languageName = langs.all().find((item) => item['1'] === movie.original_language);
        if(languageName){
            setLanguageName(languageName['name']);
        }
        const getMovieAdditionalData = async () => {
            if(movie && movie.original_title) {
                const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/getTorrentLink?movieName=${movie.original_title}`);
                if(data.message) {
                    setTorrentLink(data.message);
                }
            }
            
            const { data: trailerKeyData } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/getMovieTrailer?movieId=${movieId}`);
            if(trailerKeyData.message) {
                setTrailerKey(trailerKeyData.message);
            }
        }
        getMovieAdditionalData();
    }, [movie]);

    useEffect(() => {
        const fetchSingleMovie = async () => {
            const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/getSingleMovieData?movieId=${movieId}`);
            if(data.message) {
                setMovie(data.message);
            }
        };
        fetchSingleMovie();
    }, [movieId]);

    return (
        <>
        <Navigation/>
        <div 
            className="movie-detail" 
            style={{ backgroundImage: `url(${process.env.REACT_APP_TMDB_IMAGE_URL}/original${movie.backdrop_path})` }}
        >
            <div className="movie-overlay"></div>
            <div className="movie-content">
                <img 
                    src={`${process.env.REACT_APP_TMDB_IMAGE_URL}/w500${movie.poster_path}`} 
                    alt={movie.title} 
                    className="movie-poster"
                />
                <div className="movie-text">
                    <h1>{movie.title} - ({movie.release_date ? movie.release_date.split('-')[0] : ''})</h1>
                    <p>{movie.overview}</p>
                    <span>IMDB Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : 0}/10</span>
                    <span>Language: {languageName ? languageName : movie.original_language}</span>
                    <span>Torrent Link: <a href={torrentLink}>Download torrent magnet here</a></span>
                    {trailerKey && (
                        <iframe 
                            title="YouTube Trailer"
                            width="100%" 
                            height="500" 
                            src={`https://www.youtube.com/embed/${trailerKey}`} 
                            frameBorder="0" 
                            allowFullScreen>
                        </iframe>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}

export default MovieDetail;
