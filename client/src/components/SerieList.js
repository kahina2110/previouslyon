import React, { useState, useRef } from 'react';
import '../styles/SerieList.css';

function SerieList({ series, onSerieClick }) {
  const defaultImageURL = 'https://sign.parts/ledsignpartsimages/imagenotavailable_front.jpg';
  const longPressTimeout = useRef(null);

  const [longPress, setLongPress] = useState(false);
  const [simpleClick, setSimpleClick] = useState(false);

  const handleSerieClick = (serie) => {
    if (!longPress && simpleClick) {
      onSerieClick(serie);
    }
    setSimpleClick(false);
  };

  const handleAddToWatchlist = (serie) => {
    const apiUrl = 'https://api.betaseries.com/shows/show';
    const apiKey = '883863d3d30d';
    const apiToken = '827a73161456';

    const serieId = serie.id;

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'X-BetaSeries-Key': apiKey,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        id: serieId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Série ajoutée aux favoris:', data);
      })
      .catch((err) => console.error('Erreur lors de l\'ajout aux favoris:', err));
  };

  const handleLongPress = (serie) => {
    setLongPress(true);
    longPressTimeout.current = setTimeout(() => {
      onSerieClick(serie);
    }, 500);
  };

  const handleMouseUp = () => {
    clearTimeout(longPressTimeout.current);
    setLongPress(false);
  };

  return (
    <div>
      <h2>Liste des Séries</h2>
      <ul>
        {series.map((serie) => (
          <li key={serie.id}>
            <div
              className="card"
              onClick={() => {
                setSimpleClick(true);
                handleSerieClick(serie);
              }}
              onMouseDown={() => handleLongPress(serie)}
              onMouseUp={handleMouseUp}
            >
              <img
                src={serie.images.poster ? serie.images.poster : defaultImageURL}
                alt={serie.title}
              />
              <p>{serie.title}</p>
              <button onClick={() => handleAddToWatchlist(serie)}>Ajouter</button>
              <button onClick={() => handleSerieClick(serie)}>Voir Détails</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SerieList;