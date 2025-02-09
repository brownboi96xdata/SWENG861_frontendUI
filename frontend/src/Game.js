// src/Game.js
import React from 'react';

const Game = ({ game }) => {
  return (
    <div>
      <h2>{game.title}</h2>
      <p>Game ID: {game.gameID}</p>
      <p>Cheapest Price: {game.cheapestPrice}</p>
      <ul>
        {game.deals.map((deal, index) => (
          <li key={index}>
            <span>Store ID: {deal.storeID}</span>
            <span>Price: {deal.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Game;