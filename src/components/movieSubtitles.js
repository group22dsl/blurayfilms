import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MovieSubtitles() {
  // Group subtitles by language
  const [subtitlesByLanguage, setSubtitlesByLanguage] = useState({});
  const [subtitlesFromApi, setSubtitlesFromApi] = useState([]);
  http://localhost:5001/api/getSubtitles?movieId=68721

  useEffect(() => {
    const getPopularMovies = async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/getSubtitles?movieId=68721`);
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
    <div>
      {Object.entries(subtitlesByLanguage).map(([language, subtitles]) => (
        <div key={language}>
          <h2>Language: {language}</h2>
          <ul>
            {subtitles.map((subtitle) => (
              <li key={subtitle.id}>
                <a href={subtitle.attributes.url}>{subtitle.attributes.release}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default MovieSubtitles;
