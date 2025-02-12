import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Use the environment variable for the API URL
const API_URL = process.env.REACT_APP_API_URL;

function App() {
    const [games, setGames] = useState([]);
    const [gameId, setGameId] = useState('');

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const response = await axios.get(API_URL);
            setGames(response.data);
        } catch (error) {
            console.error("Error fetching games:", error);
        }
    };

    const deleteGame = async (id) => {
        try {
            // Assuming deletion is not supported by the API
            // You can remove this function or handle it differently based on your needs
            console.log(`Deleting game with ID: ${id} - Not implemented since API doesn't support it.`);
        } catch (error) {
            console.error("Error deleting game:", error);
        }
    };

    return (
        <div>
            <h1>Game Deals Application</h1>
            <h2>Game List</h2>
            <ul>
                {games.map(game => (
                    <li key={game.id}>
                        {game.title} - ${game.cheapestPrice}
                        <button onClick={() => deleteGame(game.id)}>Delete (not supported)</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;