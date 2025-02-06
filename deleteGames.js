const express = require('express');
const { connectDB } = require('./dbConnection'); // Assuming you have a dbConnection.js for connecting to MongoDB
const { ObjectId } = require('mongodb');

const router = express.Router();

// Deleting all games
router.delete('/games', async (req, res) => {
    try {
        const collection = await connectDB();
        const result = await collection.deleteMany({});
        res.status(200).json({ message: `${result.deletedCount} games deleted successfully` });
    } catch (error) {
        console.error('Error deleting all games:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Deleting a game by ID
router.delete('/games/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const collection = await connectDB();
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.status(200).json({ message: 'Game deleted successfully' });
    } catch (error) {
        console.error('Error deleting game:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;