import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const FetchGame = () => {
    const [setGame] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    const fetchCalled = useRef(false); // Prevents duplicate requests

    useEffect(() => {
        if (fetchCalled.current) return; // Prevents multiple fetch calls
        fetchCalled.current = true; // Mark that fetch has been initiated

        fetchAndHandleGame();
    }, []); // Ensures the effect runs only once

    const fetchAndHandleGame = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/games/fetch`);
            handleGameResponse(response);
        } catch (err) {
            handleFetchError(err);
        }
    };

    const handleGameResponse = (response) => {
        if (response.status === 201) { // Successfully inserted
            setGame(response.data);
            setSuccess("Game fetched and stored successfully!");
        } else if (response.status === 409) { // Game already exists
            setError(response.data.message || "Game already exists in the database.");
        } else {
            throw new Error("Unexpected response from server.");
        }
    };

    const handleFetchError = (err) => {
        if (err.response) {
            console.log("Error response received:", err.response); // Debugging
            setError(err.response.data.message || err.response.data.error || "An unexpected error occurred");
        } else {
            setError("Failed to fetch game. Please check your connection.");
        }
    };

    return (
        <div>
            <h1>Fetch Game</h1>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <br /><button onClick={() => navigate('/')}>Home</button>
        </div>

    );
};

export default FetchGame;
