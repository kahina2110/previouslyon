import React, { useState, useEffect } from 'react';
import '../styles/SerieDetails.css';

function SerieDetails({ serie, onBack }) {
  const [token, setToken] = useState('');

  const posterImage = serie.images.poster
    ? serie.images.poster
    : 'https://sign.parts/ledsignpartsimages/imagenotavailable_front.jpg';

  const episodeLength = serie.length ? `${serie.length} minutes` : 'Inconnu';
  const genresList = serie.genres ? Object.values(serie.genres).join(', ') : 'Inconnu';


  useEffect(() => {
   
    const stockedToken = localStorage.getItem('accessToken');
    if (stockedToken) {
      setToken(stockedToken);
    }
  }, []);
  const handleArchive = () => {
    const apiToken = token;
    const apiKey = '6732100fb7aa';
    const serieId = serie.id;

    fetch(`https://api.betaseries.com/shows/show?v=3.0&id=${serieId}`, {
      method: 'DELETE',
      headers: {
        'X-BetaSeries-Key': apiKey,
        'Authorization': `Bearer ${apiToken}`,
        'Accept': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Série archivée:', data);
      })
      .catch((err) => console.error('Erreur lors de l\'archivage de la série:', err));
  };

  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedSeasonEpisodes, setSelectedSeasonEpisodes] = useState([]);
  const [selectedEpisodeInfo, setSelectedEpisodeInfo] = useState(null);
  const [longPressTimer, setLongPressTimer] = useState(null);

  const fetchSeasons = async () => {
    try {
      const apiKey = '6732100fb7aa';
      const apiToken = token;
      const serieId = serie.id;

      const response = await fetch(`https://api.betaseries.com/shows/seasons?v=3.0&id=${serieId}`, {
        method: 'GET',
        headers: {
          'X-BetaSeries-Key': apiKey,
          'Authorization': `Bearer ${apiToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des saisons');
      }

      const data = await response.json();
      setSeasons(data.seasons);
    } catch (error) {
      console.error('Erreur lors de la récupération des saisons:', error);
    }
  };

  const fetchEpisodesForSeason = async (seasonNumber) => {
    try {
      const apiKey = '883863d3d30d';
      const apiToken = token;
      const serieId = serie.id;

      const response = await fetch(`https://api.betaseries.com/shows/episodes?v=3.0&id=${serieId}&season=${seasonNumber}`, {
        method: 'GET',
        headers: {
          'X-BetaSeries-Key': apiKey,
          'Authorization': `Bearer ${apiToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des épisodes de la saison');
      }

      const data = await response.json();
      setSelectedSeasonEpisodes(data.episodes);
      setSelectedSeason(seasonNumber);
    } catch (error) {
      console.error('Erreur lors de la récupération des épisodes de la saison:', error);
    }
  };

  const fetchEpisodeInfo = async (episodeId) => {
    try {
      const apiKey = '6732100fb7aa';
      const apiToken = token;

      const response = await fetch(`https://api.betaseries.com/episodes/display?v=3.0&id=${episodeId}`, {
        method: 'GET',
        headers: {
          'X-BetaSeries-Key': apiKey,
          'Authorization': `Bearer ${apiToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des informations de l\'épisode');
      }

      const data = await response.json();
      setSelectedEpisodeInfo(data.episode);
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de l\'épisode:', error);
    }
  };

  useEffect(() => {
    fetchSeasons();
  },);

  const handleEpisodeMouseDown = (episodeId) => {
    setLongPressTimer(
      setTimeout(() => {
        fetchEpisodeInfo(episodeId);
      }, 1000) 
    );
  };

  const handleEpisodeMouseUp = () => {
    clearTimeout(longPressTimer);
  };

  return (
    <div>
      <div>
        <div className="serie-details">
          <h2 className="serie-title">Détails de la Série</h2>
          <button onClick={onBack} className="serie-button">Retour</button>
          <img src={posterImage} alt={serie.title} className="serie-image" />
          <h3 className="serie-subtitle">{serie.title}</h3>
          <p className="serie-info">Nombre de saisons : {serie.seasons}</p>
          <p className="serie-info">Nombre d'épisodes : {serie.episodes}</p>
          <p className="serie-info">Durée des épisodes : {episodeLength}</p>
          <p className="serie-info">Note : {serie.notes.mean ? serie.notes.mean.toFixed(1) : 'Inconnu'}</p>
          <p className="serie-info">Résumé : {serie.description}</p>
          <p className="serie-info">Genres : {genresList}</p>
          <button onClick={handleArchive} className="serie-button">Archiver</button>
        </div>
      </div>

      <div>
        <h4>Saisons</h4>
        <ul className="season-list">
          {seasons.map((season) => (
            <li key={season.id}>
              <button onClick={() => fetchEpisodesForSeason(season.number)}>Saison {season.number}</button>
              {selectedSeason === season.number && (
                <div>
                  <ul className="episode-list">
                    {selectedSeasonEpisodes.map((episode) => (
                      <li key={episode.id}>
                        <p
                          className="episode-number"
                          onMouseDown={() => handleEpisodeMouseDown(episode.id)}
                          onMouseUp={handleEpisodeMouseUp}
                        >
                          Épisode {episode.episode}
                        </p>
                        <p className="episode-title">Titre: {episode.title}</p>
                      </li>
                    ))}
                  </ul>
                  {selectedEpisodeInfo && (
                    <div className="episode-details episode-info">
                      <h5>Informations de l'épisode</h5>
                      <p className="episode-title">Titre: {selectedEpisodeInfo.title}</p>
                      <img src={posterImage} alt={serie.title} className="episode-image" />
                      <p className="episode-date">Date de diffusion: {selectedEpisodeInfo.date}</p>
                      <p className="episode-note">Note : {serie.notes.mean ? serie.notes.mean.toFixed(1) : 'Inconnu'}</p>
                      <p className="episode-summary">Résumé: {selectedEpisodeInfo.description}</p>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SerieDetails;