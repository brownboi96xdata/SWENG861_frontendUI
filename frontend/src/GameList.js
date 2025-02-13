// GameList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const GameList = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/games`);
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  return (
    <div>
      <h2>Game List</h2>
      <ul>
        {games.map(game => (
          <li key={game._id}>{game.title} - ${game.cheapestPrice}</li>
        ))}
      </ul>
    </div>
  );
};

export default GameList;


// DeleteGame.js
