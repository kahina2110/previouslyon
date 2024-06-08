import React, { useEffect, useState, useRef } from 'react';
import '../styles/Dashboard.css';
import SerieDetails from './SerieDetails';

function Dashboard() {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const defaultImageURL = 'https://sign.parts/ledsignpartsimages/imagenotavailable_front.jpg';
  const [series, setSeries] = useState([]);
  const [selectedSerie, setSelectedSerie] = useState(null);
  const longPressTimeout = useRef(null);

  const backHome = () => {
    window.location.href = '/Homepage';
  };

  const goFriends = () => {
    window.location.href = '/Friends';
  }

  useEffect(() => {
    const stockedUsername = localStorage.getItem('username');
    if (stockedUsername) {
      setUsername(stockedUsername);
    }

    const stockedToken = localStorage.getItem('accessToken');
    if (stockedToken) {
      setToken(stockedToken);
    }
  }, []);

  const listSerie = () => {
    const apiUrl = ` https://api.betaseries.com/shows/member`;
    const apiKey = '883863d3d30d'; 
    const apiToken = token;
    
  
    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-BetaSeries-Key': apiKey,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,

      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setSeries(data.shows);
      })
      .catch((err) => console.error(err));
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  const handleSerieClick = (serie) => {
    setSelectedSerie(serie);
  };

  const handleSerieLongClick = (serie) => {
    longPressTimeout.current = setTimeout(() => {
      setSelectedSerie(serie);
    }, 1000);
  };

  const handleMouseUp = () => {
    clearTimeout(longPressTimeout.current);
  };

  return (
    <div className="dashboard">
      {username ? (
        <h1>Bienvenue, {username}!</h1>
      ) : (
        <h1>Bienvenue sur le tableau de bord!</h1>
      )}
      <button onClick={backHome}>Retour à la page d'accueil</button>
      <div className='serieList'>
        <h1>Mon profil</h1>
        <button onClick={listSerie}>Voir mes séries</button>
        <button onClick={logout}>Déconnexion</button>
        <button onClick={goFriends}>Voir mes amies</button>
        {selectedSerie ? (
          <SerieDetails serie={selectedSerie} onBack={() => setSelectedSerie(null)} />
        ) : (
          <div>
            <ul>
              {series.map((serie) => (
                <li key={serie.id}>
                  <div
                    className="card"
                    onClick={() => handleSerieClick(serie)}
                    onMouseDown={() => handleSerieLongClick(serie)}
                    onMouseUp={handleMouseUp}
                  >
                    <img
                      src={serie.images.poster ? serie.images.poster : defaultImageURL}
                      alt={serie.title}
                    />
                    <p>{serie.title}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;