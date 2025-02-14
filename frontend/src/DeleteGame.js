import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const DeleteGame = () => {
  const [gameId, setGameId] = useState('');

  const deleteGame = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/games/${gameId}`);
      setGameId('');
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  };

  return (
    <div>
      <h2>Delete Game</h2>
      <input type="text" placeholder="Game ID" value={gameId} onChange={(e) => setGameId(e.target.value)} />
      <button onClick={deleteGame}>Delete Game</button>
    </div>
  );
};

export default DeleteGame;
