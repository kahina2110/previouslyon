import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import SerieList from './SerieList';
import SerieDetails from './SerieDetails';



function Homepage() {
  const [view, setView] = useState('serieList');
  const [selectedSerie, setSelectedSerie] = useState(null);
  const [series, setSeries] = useState([]);
  const serieListRef = useRef();

  useEffect(() => {
    fetch('https://api.betaseries.com/shows/list?v=3.0&order=popularity', {
      method: 'GET',
      headers: {
        'X-BetaSeries-Key': '883863d3d30d',
      },
    })
      .then(response => response.json())
      .then(data => {
        setSeries(data.shows);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des séries :', error);
      });
  }, []);

  const showSerieDetails = serie => {
    setSelectedSerie(serie);
    setView('serieDetails');
  };

  const goBackToList = () => {
    setSelectedSerie(null);
    setView('serieList');
  };

  const handleClick = event => {
    if (!serieListRef.current.contains(event.target)) {
      event.preventDefault();
    }
  };

  const backProfile = () => {
    window.location.href = '/Dashboard';
  }

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Netflex</h1>
        <p>Bienvenue sur Netflex</p>
        
        <button onClick={backProfile}>Accéder à mon profil</button>

      </header>
      <div ref={serieListRef}>
        {view === 'serieList' && (
          <SerieList series={series} onSerieClick={showSerieDetails} />
        )}
      </div>
      {view === 'serieDetails' && (
        <SerieDetails serie={selectedSerie} onBack={goBackToList} />
      )}
    </div>
  );
}

export default Homepage;