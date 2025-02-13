import React, { useState } from 'react';
import axios from 'axios';

const AddGame = () => {
  const [newGame, setNewGame] = useState({ title: '', cheapestPrice: '' });

  const addGame = async () => {
    try {
      await axios.post('/api/games', newGame);
      setNewGame({ title: '', cheapestPrice: '' });
    } catch (error) {
      console.error('Error adding game:', error);
    }
  };

  return (
    <div>
      <h2>Add New Game</h2>
      <input type="text" placeholder="Title" value={newGame.title} onChange={(e) => setNewGame({ ...newGame, title: e.target.value })} />
      <input type="number" placeholder="Cheapest Price" value={newGame.cheapestPrice} onChange={(e) => setNewGame({ ...newGame, cheapestPrice: e.target.value })} />
      <button onClick={addGame}>Add Game</button>
    </div>
  );
};

export default AddGame;