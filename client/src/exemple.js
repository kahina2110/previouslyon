import React, { useState, useRef, useEffect } from 'react';
import '../styles/SerieList.css';

function SerieList({ series, onSerieClick }) {
  const defaultImageURL = 'https://sign.parts/ledsignpartsimages/imagenotavailable_front.jpg';
  const longPressTimeout = useRef(null);
  const [token, setToken] = useState('');


  const handleSerieClick = (serie) => {
    if (!longPress && simpleClick) {
      onSerieClick(serie);
    }
    setSimpleClick(false);
  };

  useEffect(() => {
  
    const stockedToken = localStorage.getItem('accessToken');
    if(stockedToken) {
      setToken(stockedToken);
    }
  }, []);

  const handleAddToWatchlist = (serie) => {
    // Effectuer une requête POST à l'API Betaseries pour ajouter la série aux favoris
    const apiUrl = 'https://api.betaseries.com/shows/show';
    const apiKey = '6732100fb7aa'; 
    const apiToken = token;
    
    const serieId = serie.id; // L'ID de la série que vous souhaitez ajouter aux favoris
 
    

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'X-BetaSeries-Key': apiKey,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        id: serieId, // ID de la série à ajouter aux favoris
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Série ajoutée aux favoris:', data);
        // Vous pouvez gérer la réponse de l'API ici si nécessaire
      })
      .catch((err) => console.error('Erreur lors de l\'ajout aux favoris:', err));
  };

  const handleLongPress = (serie) => {
    setLongPress(true);
    longPressTimeout.current = setTimeout(() => {
      onSerieClick(serie);
    }, 1000);
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
              <button onClick={() => handleAddToWatchlist(serie)}>+</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SerieList;