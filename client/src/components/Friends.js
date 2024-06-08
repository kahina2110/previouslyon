import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

function Friends() {
  const [token, setToken] = useState('');
  const [friendsList, setFriendsList] = useState([]);
  const [memberId, setMemberId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [DMs, setDMs] = useState([]);

  const apiKey = '883863d3d30d';

  useEffect(() => {
    const stockedToken = localStorage.getItem('accessToken');
    if (stockedToken) {
      setToken(stockedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      listFriend();
    }
  }, [token]);

  const listFriend = () => {
    const apiUrl = 'https://api.betaseries.com/friends/list';

    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-BetaSeries-Key': apiKey,
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      setFriendsList(data.users || []);
    })
    .catch((err) => console.error(err));
  };

  const AddFriends = (e) => {
    e.preventDefault();
    const apiUrl = `https://api.betaseries.com/friends/friend?id=${memberId}`;
    
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'X-BetaSeries-Key': apiKey,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      setSuccessMessage('Ami ajouté avec succès');
      setTimeout(() => setSuccessMessage(''), 1000);
      setFriendsList(prevFriends => [...prevFriends, data.member]);
      console.log(`Ajout du membre : ${data.member.login}`);
    });
  }

  const BlockFriends = (friendId) => {
    const apiUrl = `https://api.betaseries.com/friends/block?id=${friendId}`;
    
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'X-BetaSeries-Key': apiKey,
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      setSuccessMessage('Ami bloqué');
      setTimeout(() => setSuccessMessage(''), 1000);
      setFriendsList(prevFriends => prevFriends.filter(friend => friend.id !== friendId));
    })
    .catch((err) => console.error(err));
  }

  const DeleteFriends = (friendId) => {
    const apiUrl = `https://api.betaseries.com/friends/friend?id=${friendId}`;
    
    fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'X-BetaSeries-Key': apiKey,
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      setSuccessMessage('Ami supprimé');
      setTimeout(() => setSuccessMessage(''), 1000);
      setFriendsList(prevFriends => prevFriends.filter(friend => friend.id !== friendId));
    })
    .catch((err) => console.error(err));
  }

  const listDM = () => {
    const apiUrl = 'https://api.betaseries.com/friends/requests';

    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-BetaSeries-Key': apiKey,
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      setDMs(data.users || []);
    });
  }

  return (
    <div>
      <Navbar />
      <input type="text" name="friends" placeholder="Ajouter un ami" onChange={(e) => setMemberId(e.target.value)} />
      <button type="submit" onClick={AddFriends}>Ajouter</button>
      
      <h2>Mes amis</h2>
      {successMessage && <div style={{ color: 'green', backgroundColor: 'rgb(207, 242, 207)', width: '150px', borderRadius: '10px', marginLeft: 'auto', marginRight: 'auto' }}>{successMessage}</div>}
      <ul style={{ display: 'flex', flexDirection: 'column', margin: '40px' }}>
        {friendsList.map((friend) => (
          <li style={{ fontWeight: 'bold', fontSize: '30px', padding: '15px' }} key={friend.id}>
            {friend.login}
            <button onClick={() => DeleteFriends(friend.id)} style={{ marginLeft: 'auto', marginRight: 'auto' }}>Supprimer</button>
            <button onClick={() => BlockFriends(friend.id)} style={{ marginLeft: 'auto', marginRight: 'auto' }}>Bloquer</button>
          </li>
        ))}
      </ul>
      <button onClick={listDM} style={{ marginLeft: 'auto', marginRight: 'auto' }}>Mes demandes d'amis</button>
      <ul>
        
        {DMs.map((DM, index) => (
          <li key={index}>{DM.login} - {DM.friendship}</li>
        ))}
      </ul>
    </div>
  );
}

export default Friends;