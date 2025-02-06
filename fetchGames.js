const axios = require('axios');
const { MongoClient } = require('mongodb');

const fetchAndStoreGame = async () => {
    const API_URL = process.env.CHEAPSHARK_API;
    const MONGO_URI = process.env.MONGO_URI; // MongoDB connection string
    const DB_NAME = process.env.DB_NAME; // Database name
    const COLLECTION_NAME = 'games'; // Collection name

    let client;

    try {
        // Connect to MongoDB
        client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

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
    } finally {
        if (client) {
            await client.close();
        }
    }
};

module.exports = fetchAndStoreGame;