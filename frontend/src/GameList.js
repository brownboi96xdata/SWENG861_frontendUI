// src/GameList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Game from './Game';

const GameList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/api/games')
      .then(response => {
        setGames(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Game List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {games.map((game, index) => (
            <li key={index}>
              <Game game={game} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GameList;