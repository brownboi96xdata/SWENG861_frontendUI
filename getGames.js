const express = require('express');
const { connectDB } = require('./dbConnection'); // Assuming you have a dbConnection.js for connecting to MongoDB
const { ObjectId } = require('mongodb');

const router = express.Router();

// Getting all games
router.get('/games', async (req, res) => {
    const collection = await connectDB();
    try {
        const games = await collection.find().toArray();
        console.log("Fetched all games");
        res.json(games);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: "Failed to fetch games" });
    }
});

// Getting a game by ID
router.get('/games/:id', async (req, res) => {
    const collection = await connectDB();
    try {
        const game = await collection.findOne({ _id: new ObjectId(req.params.id) });
        if (!game) {
            throw new Error("Game not found");
        }
        console.log(`Fetched game with ID: ${req.params.id}`);
        res.json(game);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;