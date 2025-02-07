const Game = require('../models/Game');
const { fetchGameFromAPI } = require('../services/gameService');

// GET all games from the database
exports.getGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET a game by ID (fetches from API and stores in DB if not found)
exports.getGameById = async (req, res) => {
  try {
    let game = await Game.findById(req.params.id);
    if (!game) {
      // Fetch from CheapShark API if not found in DB
      const apiGame = await fetchGameFromAPI(req.params.id);
      if (!apiGame) return res.status(404).json({ message: 'Game not found' });

      game = new Game({
        title: apiGame.info.title,
        price: apiGame.deals[0].price,
        storeID: apiGame.deals[0].storeID,
        releaseDate: new Date()
      });

      await game.save();
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST - Add a new game manually
exports.createGame = async (req, res) => {
  const game = new Game(req.body);
  try {
    const newGame = await game.save();
    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT - Update an existing game
exports.updateGame = async (req, res) => {
  try {
    const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE - Remove a game
exports.deleteGame = async (req, res) => {
  try {
    await Game.findByIdAndDelete(req.params.id);
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
