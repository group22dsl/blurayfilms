// src/components/MovieDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import langs from 'langs';
import '../App.css';
import Nav from './nav';
import { useAuth0 } from "@auth0/auth0-react";
import MovieSubtitles from './movieSubtitles';
import { Grid } from '@mui/material';
import {
    Button
  } from "reactstrap";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Helmet } from 'react-helmet';

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
        <Helmet>
            <title>{`Download movie or subtitle for ${movie.title} - (${movie.release_date ? movie.release_date.split('-')[0] : ''})`}</title>
            <meta name="description" content={`${movie.title} - (${movie.release_date ? movie.release_date.split('-')[0] : ''}) - Download your favorite movies, subtitles, and explore detailed movie information. Your go-to source for high-quality entertainment.`} />
            <meta name="keywords" content={movie.title} />
        </Helmet>
        <Nav/>
        <Grid container spacing={2} className="movie-detail-body">
            <Grid item xs={12} md={12} lg={1}>
            </Grid>
            <Grid item xs={12} md={3} lg={2}>
                <div className='poster-content'>
                    <img 
                        src={`${process.env.REACT_APP_TMDB_IMAGE_URL}/w500${movie.poster_path}`} 
                        alt={movie.title} 
                        className="movie-poster"
                    />
                </div>
            </Grid>
            <Grid item xs={12} md={9} lg={5}>
                <div className="movie-text">
                    <h1>{movie.title} - ({movie.release_date ? movie.release_date.split('-')[0] : ''})</h1>
                    <p>{movie.overview}</p>
                    <span>IMDB Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : 0}/10</span>
                    <span>Language: {languageName ? languageName : movie.original_language}</span>
                    {/* <span>Torrent Link: <a href={torrentLink}>Download torrent magnet here</a></span> */}
                    {trailerKey && (
                        <iframe
                            className='trailer-iframe'
                            title="YouTube Trailer"
                            width="100%" 
                            height="400" 
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
            </Grid>
            <Grid item xs={12} md={12} lg={3}>
                <div className="watch-providers-container">
                    <h2>Download Movie</h2>
                    <div className="select-box">
                        <div>
                            {torrentFiles.map((torrent) => (
                                <a href={torrent.url}><Button className="movie-download-button"><CloudDownloadIcon/> &nbsp;&nbsp;&nbsp;&nbsp;<b>Download {torrent.size} {torrent.video_codec} [{torrent.quality}] {torrent.type} file</b></Button></a>
                            ))}
                            <a href={torrentLink}><Button className="movie-download-button"><CloudDownloadIcon/> &nbsp;&nbsp;&nbsp;&nbsp;<b>Download movie as magnet file</b></Button></a>
                        </div>
                    </div>  
                </div>
                <div className="watch-providers-container">
                    <h2>Disclaimer</h2>
                    <div className="disclaimer-box">
                    <p>ikmovies.com is a platform dedicated to movie enthusiasts, offering movie downloads, subtitle downloads, and an exploration of cinematic content. It's important to note that we do not claim ownership of the copyrights for the images and videos featured on our site.

All images and videos are sourced from public domains or used with permission. If you are the rightful owner of any content displayed on our site and wish to have it removed, please contact us. We highly value the intellectual property rights of content creators, and we are committed to promptly addressing any concerns.

Our goal is to provide a seamless and enjoyable experience for our users while respecting the original creators' rights. Proper attribution is given whenever possible. Thank you for choosing ikmovies.com for your movie-related needs.</p>
                    </div>  
                </div>
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
            </Grid>
            <Grid item xs={12} md={12} lg={1}>
            </Grid>
        </Grid>
        </>
    );
}

export default MovieDetail;
