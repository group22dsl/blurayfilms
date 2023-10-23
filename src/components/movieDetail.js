// src/components/MovieDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import langs from 'langs';
import '../App.css';
import Navigation from './navigation';
import { useAuth0 } from "@auth0/auth0-react";
import MovieSubtitles from './movieSubtitles';
import {
    Button
  } from "reactstrap";

function MovieDetail() {

    const {
        isLoading,
        isAuthenticated,
        loginWithRedirect,
      } = useAuth0();

    const { id: movieId } = useParams();
    const [movie, setMovie] = useState({});
    const [languageName, setLanguageName] = useState();
    const [torrentLink, setTorrentLink] = useState();
    const [trailerKey, setTrailerKey] = useState();
    const [regions, setRegions] = useState([]);
    const [watchProviders, setWatchProviders] = useState({});
    const [selectedProviders, setSelectedProviders] = useState({});
    const [torrentFiles, setTorrentFiles] = useState([]);

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

            const { data: torrentFilesData } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/getTorrentsForMovie?movieId=${movie.imdb_id}`);
            if(torrentFilesData.message) {
                setTorrentFiles(torrentFilesData.message);
            }

            const { data: regionsData } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/getAvailableRegions`);
            if(regionsData.message) {
                const sortedData = regionsData.message.sort((a, b) => {
                    if (a.english_name < b.english_name) {
                      return -1;
                    } else if (a.english_name > b.english_name) {
                      return 1;
                    } else {
                      return 0;
                    }
                });
                setRegions(sortedData);
            }

            const { data: providersData } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/getMovieWatchProviders?movieId=${movieId}`);
            if(providersData.message) {
                setWatchProviders(providersData.message);
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
    }, [movieId, isLoading, isAuthenticated]);

    const handleChange = (e) => {
        setSelectedProviders(watchProviders[e.target.value]);
    }

    return (
        <>
        <Navigation/>
        <div 
            className="movie-detail" 
            style={{ backgroundImage: `url(${process.env.REACT_APP_TMDB_IMAGE_URL}/original${movie.backdrop_path})` }}
        >
            <div className="movie-overlay"></div>
            <div className="movie-content">
                <div className='poster-content'>
                    <img 
                        src={`${process.env.REACT_APP_TMDB_IMAGE_URL}/w500${movie.poster_path}`} 
                        alt={movie.title} 
                        className="movie-poster"
                    />
                    {/* <div className="movie-details-container">
                        <span>IMDB Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : 0}/10</span>
                        <span>Language: {languageName ? languageName : movie.original_language}</span>
                    </div> */}
                </div>
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
                    {!isLoading && !isAuthenticated ? <Button
                          id="loginBtn"
                          color="primary"
                          className="subtitle-login"
                          onClick={() => loginWithRedirect({ appState: { returnTo: window.location.pathname } })}
                        >
                          Click here to <b>login</b> or <b>sign up</b> to download subtitles
                    </Button> : <MovieSubtitles/>}
                </div>
                <div className="movie-stream">
                   <div className="movie-stream-inside">
                       <div className="watch-providers-container">
                            <h2>Watch Providers</h2>
                            <div className="select-box">
                                <select className="modern-select" onChange={(e) => handleChange(e)}>
                                    <option value=''>Select Region</option>
                                    {regions.map(region => (
                                        <option value={region.iso_3166_1}>{region.english_name}</option>
                                    ))}
                                </select>
                                <div className="select-icon">
                                    <i className="fas fa-chevron-down"></i>
                                </div>
                            </div>
                            {selectedProviders && selectedProviders["flatrate"] && 
                                <>
                                    <h4>For Flat Rate</h4>
                                    <div className="watch-provider-list">
                                        {selectedProviders["flatrate"].map((provider) => (
                                            <div key={provider.provider_name} className="watch-provider">
                                            <img
                                                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                                alt={`${provider.provider_name} Logo`}
                                            />
                                            </div>
                                        ))}
                                    </div>
                                 </>
                            }
                            {selectedProviders && selectedProviders["buy"] && 
                            <>
                                <h4>For Buy</h4>
                                    <div className="watch-provider-list">
                                    {selectedProviders["buy"].map((provider) => (
                                        <div key={provider.provider_name} className="watch-provider">
                                        <img
                                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                            alt={`${provider.provider_name} Logo`}
                                        />
                                        </div>
                                    ))}
                                </div>
                            </>
                            }
                             {selectedProviders && selectedProviders["rent"] && 
                             <>
                                <h4>For Rent</h4>
                                <div className="watch-provider-list">
                                    
                                {selectedProviders["rent"].map((provider) => (
                                    <div key={provider.provider_name} className="watch-provider">
                                    <img
                                        src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                        alt={`${provider.provider_name} Logo`}
                                    />
                                    </div>
                                ))}
                                </div>
                            </>
                            }
                        </div>
                        <div className="watch-providers-container">
                            <h2>Download Movie</h2>
                            <div className="select-box">
                                {!isLoading && !isAuthenticated ? <Button
                                    id="loginBtn"
                                    color="primary"
                                    className="subtitle-login"
                                    onClick={() => loginWithRedirect({ 
                                        appState: { 
                                            returnTo: window.location.pathname 
                                        } 
                                    })}
                                    >
                                    Click here to <b>login</b> or <b>sign up</b> to download Movie
                                </Button>: <div>
                                        {torrentFiles.map((torrent) => (
                                        <a href={torrent.url}><Button className="movie-download-button">{torrent.size} {torrent.video_codec} [{torrent.quality}] {torrent.type}</Button></a>
                                        ))}
                                </div>}
                            </div>
                           
                        </div>
                   </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default MovieDetail;
