const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const { validateGameAttributes, validateDeals } = require('./validation');

const router = express.Router();

// MongoDB connection details
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;
const COLLECTION_NAME = 'games';

// Function to connect to MongoDB
const connectDB = async () => {
    const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    return client.db(DB_NAME).collection(COLLECTION_NAME);
};

// Fetch existing game from the database
const fetchExistingGame = async (collection, gameId) => {
    const existingGame = await collection.findOne({ _id: gameId });
    if (!existingGame) {
        throw new Error("Game not found.");
    }
    return existingGame;
};

// Check if the new game data is the same as the existing game data
const checkIfSameGame = (existingGame, newGameData) => {
    return (
        existingGame.gameID === newGameData.gameID &&
        existingGame.title === newGameData.title &&
        existingGame.thumb === newGameData.thumb &&
        existingGame.cheapestPrice === newGameData.cheapestPrice &&
        JSON.stringify(existingGame.deals) === JSON.stringify(newGameData.deals)
    );
};

// Update game data in the database
const updateGame = async (collection, gameId, newGameData) => {
    return await collection.updateOne(
        { _id: gameId },
        { $set: newGameData }
    );
};

// Update an existing game by ID
router.put('/games/:id', async (req, res) => {
    try {
        const collection = await connectDB();
        const { gameID, title, thumb, cheapestPrice, deals } = req.body;

        validateGameAttributes(req.body);
        validateDeals(deals);

        const gameId = new ObjectId(req.params.id);
        const existingGame = await fetchExistingGame(collection, gameId);

        const isSameGame = checkIfSameGame(existingGame, { gameID, title, thumb, cheapestPrice, deals });

        if (isSameGame) {
            throw new Error("No changes detected. Provide at least one unique update.");
        }

        const result = await updateGame(collection, gameId, { gameID, title, thumb, cheapestPrice, deals });

        if (result.modifiedCount === 0) {
            throw new Error("Game not found or no changes made.");
        }

        const successMessage = `Game updated with ID: ${req.params.id}`;
        console.log(successMessage);
        res.json({ message: successMessage });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;