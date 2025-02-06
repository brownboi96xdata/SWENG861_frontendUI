const axios = require('axios');
const { connectDB } = require('./dbConnection'); // Assuming you have a dbConnection.js for connecting to MongoDB

// Fetch and store game data from CheapShark API
const fetchAndStoreGame = async () => {
    const API_URL = process.env.CHEAPSHARK_API;
    const collection = await connectDB();

    try {
        // Fetch game data
        const response = await axios.get(API_URL);
        const gameData = response.data;

        if (!gameData || Object.keys(gameData).length === 0) {
            console.log("No valid data received from API.");
            return { error: "Invalid API response" };
        }

        // Transform the data to store only relevant fields
        const formattedGame = {
            gameID: gameData.info.gameID,
            title: gameData.info.title,
            thumb: gameData.info.thumb,
            cheapestPrice: gameData.cheapestPriceEver.price,
            deals: gameData.deals
                .filter(deal => deal.storeID != null && deal.price != null)
                .map(deal => ({
                    storeID: deal.storeID,
                    price: deal.price
                }))
        };

        // Check if the game already exists
        const existingGame = await collection.findOne({ gameID: formattedGame.gameID });

        if (existingGame) {
            console.log("Game already exists in database.");
            return { message: "Game already exists" };
        }

        // Insert into MongoDB
        const result = await collection.insertOne(formattedGame);
        console.log("Game successfully inserted:", result.insertedId);

        return { message: "Game inserted successfully!", id: result.insertedId };
    } catch (error) {
        console.error("Error fetching and storing game data:", error);
        return { error: "Failed to fetch/store game data" };
    }
};

// API Route to manually trigger data fetching
const setupFetchStoreRoute = (app) => {
    app.post('/fetch-store', async (req, res) => {
        const result = await fetchAndStoreGame();
        res.json(result);
    });
};

module.exports = {
    fetchAndStoreGame,
    setupFetchStoreRoute
};