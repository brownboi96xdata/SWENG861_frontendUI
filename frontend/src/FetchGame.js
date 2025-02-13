import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const GameList = () => {
    const [games, setGames] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/games`);
                setGames(response.data);
            } catch (err) {
                if (err.response) {
                    // Backend responded with an error
                    setError(err.response.data.error || "An unexpected error occurred");
                } else {
                    // Network error or no response
                    setError("Failed to fetch games. Please check your connection.");
                }
            }
        };

        fetchGames();
    }, []);

    return (
        <div>
            <h1>Game List</h1>
            {error ? (
                <p style={{ color: "red" }}>Error: {error}</p>
            ) : (
                <ul>
                    {games.map((game) => (
                        <li key={game._id}>
                        Title: {game.title} <br />
                        GameID: ${game.gameID} <br />
                        Thumb: {game.thumb} <br />
                        Cheapest Price: {game.cheapestPrice.toFixed(2)} <br />
                    </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GameList;
