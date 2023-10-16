// src/components/MovieDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function MovieDetail() {

    const { id: movieId } = useParams();
    const [movie, setMovie] = useState({});
    const [torrentLink, setTorrentLink] = useState();
    const [trailerKey, setTrailerKey] = useState();

    useEffect(() => {
        const getMovieAdditionalData = async () => {
            if(movie && movie.original_title) {
                const { data } = await axios.get(`http://localhost:5001/api/getTorrentLink?movieName=${movie.original_title}`);
                if(data.message) {
                    setTorrentLink(data.message);
                }
            }
            
            const { data: trailerKeyData } = await axios.get(`http://localhost:5001/api/getMovieTrailer?movieId=${movieId}`);
            if(trailerKeyData.message) {
                setTrailerKey(trailerKeyData.message);
            }
        }
        getMovieAdditionalData();
    }, [movie]);

    useEffect(() => {
        const fetchSingleMovie = async () => {
            const { data } = await axios.get(`http://localhost:5001/api/getSingleMovieData?movieId=${movieId}`);
            if(data.message) {
                setMovie(data.message);
            }
        };
        fetchSingleMovie();
    }, [movieId]);

    return (
        <div 
            className="movie-detail" 
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
        >
            <div className="movie-overlay"></div>
            <div className="movie-content">
                <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                    alt={movie.title} 
                    className="movie-poster"
                />
                <div className="movie-text">
                    <h1>{movie.title} - ({movie.release_date ? movie.release_date.split('-')[0] : ''})</h1>
                    <p>{movie.overview}</p>
                    <span>IMDB Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : 0}/10</span>
                    <span>Language: {movie.vote_average}/10</span>
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
    );
}

export default MovieDetail;
