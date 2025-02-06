const express = require('express');
const { connectDB } = require('./dbConnection'); // Assuming you have a dbConnection.js for connecting to MongoDB
const { validateGameAttributes, validateDeals } = require('./validation'); // Assuming validation.js contains these functions

const router = express.Router();

// Create a new game with specified attributes
router.post('/games', async (req, res) => {
    const collection = await connectDB();
    try {
        const { gameID, title, thumb, cheapestPrice, deals } = req.body;

        // Validate game attributes
        validateGameAttributes(req.body);

        // Validate and transform the incoming data
        validateDeals(deals);

        // Check for existing game with the same gameID or title
        const existingGame = await collection.findOne({
            $or: [
                { gameID: { $ne: null, $eq: gameID } },
                { title }
            ]
        });
        
        if (existingGame) {
            throw new Error("A game with the same gameID or title already exists.");
        }

        const newGame = {
            gameID,
            title,
            thumb,
            cheapestPrice,
            deals
        };

        const result = await collection.insertOne(newGame);
        const successMessage = `Game added with ID: ${result.insertedId}`;
        console.log(successMessage);
        res.status(201).json({ message: successMessage });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;