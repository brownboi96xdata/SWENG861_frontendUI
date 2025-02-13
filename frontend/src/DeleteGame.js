import React, { useState } from 'react';
import axios from 'axios';

const DeleteGame = () => {
  const [gameId, setGameId] = useState('');

  const deleteGame = async () => {
    try {
      await axios.delete(`https://localhost:5000/api/games/${gameId}`);
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
