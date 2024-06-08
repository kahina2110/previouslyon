import React, { useState } from 'react';
import axios from 'axios';
import md5 from 'md5';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError('');

      const apiUrl = 'https://api.betaseries.com/members/auth';
      const apiKey = '883863d3d30d'; 
      const hashedPassword = md5(password);

      const response = await axios.post(
        apiUrl,
        {
          login: username,
          password: hashedPassword,
        },
        {
          headers: {
            'X-BetaSeries-Key': apiKey,
          },
        }
      );

      if (response.data && response.data.token) {
        const token = response.data.token;
        localStorage.setItem('accessToken', token);
        localStorage.setItem('username', username);

        navigate('/dashboard');
      } else {
        setError('Token non trouvé dans la réponse.');
      }
    } catch (error) {
      if (error.response && error.response.data.errors[0]) {
        setError(error.response.data.errors[0].text);
      } else {
        setError('Une erreur inattendue s\'est produite.');
      }
    }
  };

  return (
    <div className="Login">
      <h1>Connexion à BetaSeries Netflex</h1>
      <div>
        <input
          placeholder="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Se connecter</button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default Login;
