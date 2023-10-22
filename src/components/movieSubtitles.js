import React, { useState, useEffect } from 'react';
import axios from 'axios';
import langs from 'langs';
import { useParams } from 'react-router-dom';

function MovieSubtitles() {
  // Group subtitles by language
  const [subtitlesByLanguage, setSubtitlesByLanguage] = useState({});
  const [subtitlesFromApi, setSubtitlesFromApi] = useState([]);
  const { id: movieId } = useParams();

  useEffect(() => {
    const getPopularMovies = async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/getSubtitles?movieId=${movieId}`);
        if(data.message) {
            setSubtitlesFromApi(data.message);
        }
    }
    getPopularMovies();
}, []);

useEffect(() => {
    const subtitlesByLanguage = {};
    subtitlesFromApi.forEach((subtitle) => {
        const language = subtitle.attributes.language;
    
        if (!subtitlesByLanguage[language]) {
          subtitlesByLanguage[language] = [];
        }
    
        subtitlesByLanguage[language].push(subtitle);
      });
      setSubtitlesByLanguage(subtitlesByLanguage);
}, [subtitlesFromApi]);

  return (
    <div className="subtitles-container">
      {Object.entries(subtitlesByLanguage).map(([language, subtitles]) => {
          const languageCode = language.split('-')[0];
         const languageName = langs ? langs.all().find((item) => item['1'] === languageCode) : '';
          return (
        <div key={language}>
          <h2>{languageName ? languageName["name"] : language} Subtitle files</h2>
          <ul className="subtitle-list">
            {subtitles.map((subtitle) => (
              <li key={subtitle.id}>
                <a className="subtitle-list-element" href={subtitle.attributes.url}>{subtitle.attributes.release}</a>
              </li>
            ))}
          </ul>
        </div>
          )
    })}
    </div>
  );
}

export default MovieSubtitles;
