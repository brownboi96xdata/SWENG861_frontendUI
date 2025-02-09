const { MongoClient, ObjectId } = require('mongodb');
const axios = require('axios');
require('dotenv').config();

const DATABASE_NAME = "gameDB";
const COLLECTION_NAME = "games";

// Connecting to MongoDB database
const connectDB = async () => {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    return client.db(DATABASE_NAME).collection(COLLECTION_NAME);
};

// Validate deals array
const isDealValid = (deal) => {
    return deal.storeID !== null && deal.storeID !== "" && deal.price !== null && deal.price !== "";
};

const isNumerical = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
};

const isValidUrl = (url) => {
    const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!urlPattern.test(url);
};

const hasUniqueStoreIDs = (deals) => {
    const storeIDSet = new Set();
    for (const deal of deals) {
        if (storeIDSet.has(deal.storeID)) {
            return false;
        }
        storeIDSet.add(deal.storeID);
    }
    return true;
};

const validateDealAttributes = (deals) => {
    deals.forEach(deal => {
        if (!isDealValid(deal)) {
            throw new Error("Each deal must have a non-null storeID and price.");
        }
        if (!isNumerical(deal.price)) {
            throw new Error(`Price must be a numerical value. Invalid value: ${deal.price}`);
        }
    });
};

const validateCheapestPrice = (cheapestPrice) => {
    if (!isNumerical(cheapestPrice)) {
        throw new Error(`CheapestPrice must be a numerical value. Invalid value: ${cheapestPrice}`);
    }
};

const validateDeals = (deals) => {
    if (!Array.isArray(deals) || deals.length === 0) {
        throw new Error("Deals array cannot be empty.");
    }

    validateDealAttributes(deals);

    if (!hasUniqueStoreIDs(deals)) {
        throw new Error("Duplicate storeID found.");
    }

    return deals.map(deal => ({
        storeID: deal.storeID,
        price: deal.price
    }));
};

// Validate game attributes
const validateGameAttributes = (game) => {
    const requiredAttributes = ['title', 'cheapestPrice', 'deals'];
    const invalidAttributes = requiredAttributes.filter(attr => isAttributeInvalid(game, attr));
    
    validateCheapestPrice(game.cheapestPrice);

    if (invalidAttributes.length > 0) {
        throw new Error(`Missing or empty required attributes: ${invalidAttributes.join(', ')}`);
    }
};

const isAttributeInvalid = (game, attr) => {
    // Custom validation logic for each attribute
    switch (attr) {
        case 'title':
        case 'cheapestPrice':
        case 'deals':
            return !game[attr] || game[attr] === null || game[attr] === '';
        default:
            return false;
    }
};

// CRUD Operations
// Fetch and store game data from CheapShark API (POST)
const fetchAndStoreGame = async (req, res) => {
    const API_URL = process.env.CHEAPSHARK_API;
    const collection = await connectDB();

    try {
        // Fetch game data
        const response = await axios.get(API_URL);
        const gameData = response.data;

        if (!gameData || Object.keys(gameData).length === 0) {
            console.log("No valid data received from API.");
            return res.status(404).json({ error: "Invalid API response" });
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

        // Check if the game already exists by non-null gameID or title
        const existingGame = await collection.findOne({
            $or: [
                { gameID: { $ne: null, $eq: formattedGame.gameID } },
                { title: formattedGame.title }
            ]
        });

        if (existingGame) {
            console.log("Game already exists in the database. Skipping insertion.");
            console.log("GameID:", existingGame.gameID);
            return res.status(409).json({ message: "Game already exists in the database." });
        }

        // Insert into MongoDB
        const result = await collection.insertOne(formattedGame);
        console.log("Game successfully inserted:", result.insertedId);

        return res.status(201).json({ message: "Game inserted successfully!", id: result.insertedId });
    } catch (error) {
        console.error("Error fetching and storing game data:", error);
        return res.status(500).json({ error: "Failed to fetch/store game data" });
    }
};

//---------------Create a Game (POST)-----------------------------------
const addGame = async (req, res) => {
    const collection = await connectDB();
    try {
        const { title, thumb, cheapestPrice, deals } = req.body;

        // Validate game data
        validateGameData({ title, thumb, cheapestPrice, deals });

        // Check if the game already exists by title
        const existingGame = await collection.findOne({ title });
        if (existingGame) {
            return res.status(409).json({ message: "Game already exists in the database." });
        }

        // Insert new game into the database
        const newGame = { title, thumb, cheapestPrice, deals };
        const result = await collection.insertOne(newGame);

        console.log("Game successfully added:", result.insertedId);
        res.status(201).json({ message: "Game added successfully!", id: result.insertedId });
    } catch (error) {
        console.error("Error adding game:", error);
        res.status(500).json({ error: "Failed to add game" });
    }
};

// Other CRUD operations...

//---------------Update a Game (PUT)-----------------------------------
const validateGameData = ({ title, thumb, cheapestPrice, deals }) => {
    validateTitle(title);
    if (cheapestPrice) {
        validateCheapestPrice(cheapestPrice);
    }
    if (deals) {
        validateDeals(deals);
    }
};

const validateTitle = (title) => {
    if (title && (title.trim() === '')) {
        throw new Error("Game title cannot be blank.");
    }
};

const updateGame = async (req, res) => {
    const collection = await connectDB();
    try {
        const gameId = new ObjectId(req.params.id);
        const existingGame = await fetchExistingGame(collection, gameId);
        const update = createUpdateObject(req.body);
        validateGameData(update);

        if (Object.keys(update).length === 0) {
            throw new Error("No changes detected. Provide at least one unique update.");
        }

        const result = await updateGameInDB(collection, gameId, update);

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
};

const createUpdateObject = (body) => {
    const update = {};
    if (body.title) update.title = body.title;
    if (body.thumb) update.thumb = body.thumb;
    if (body.cheapestPrice) update.cheapestPrice = body.cheapestPrice;
    if (body.deals) update.deals = body.deals;
    return update;
};

const fetchExistingGame = async (collection, gameId) => {
    const existingGame = await collection.findOne({ _id: gameId });
    if (!existingGame) {
        throw new Error("Game not found.");
    }
    return existingGame;
};

const isSameGame = (existingGame, newGameData) => {
    return (
        existingGame.gameID === newGameData.gameID &&
        existingGame.title === newGameData.title &&
        existingGame.thumb === newGameData.thumb &&
        existingGame.cheapestPrice === newGameData.cheapestPrice &&
        JSON.stringify(existingGame.deals) === JSON.stringify(newGameData.deals)
    );
};

const updateGameInDB = async (collection, gameId, newGameData) => {
    return await collection.updateOne(
        { _id: gameId },
        { $set: newGameData }
    );
};

//------------- Getting All Games (GET)-------------------------------------
const getAllGames = async (req, res) => {
    const collection = await connectDB();
    try {
        const games = await collection.find().toArray();
        console.log("Fetched all games");
        res.json(games);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: "Failed to fetch games" });
    }
};

//-------------Getting Game By ID (GET)------------------------------------------
const getGameById = async (req, res) => {
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
};

//---------------Deleting All Games (DELETE)---------------------------------
const deleteAllGames = async (req, res) => {
    try {
        const collection = await connectDB();
        const result = await collection.deleteMany({});
        
        if (result.deletedCount === 0) {
            res.status(404).json({ message: 'No games found to delete' });
            console.log('No games found to delete.');
            return;
        }

        res.status(200).json({ message: `${result.deletedCount} games deleted successfully` });
        console.log('All games deleted.');
    } catch (error) {
        console.error('Error deleting all games:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//---------------Deleting a Game By ID (DELETE)------------------------------------
const deleteGameById = async (req, res) => {
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
};

module.exports = {
    fetchAndStoreGame,
    addGame,
    updateGame,
    getAllGames,
    getGameById,
    deleteAllGames,
    deleteGameById
};