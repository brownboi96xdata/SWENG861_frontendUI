const express = require('express');
const { getGames, getGameById, createGame, updateGame, deleteGame } = require('../controllers/gameController');

const router = express.Router();

router.get('/games', getGames);
router.get('/games/:id', getGameById);
router.post('/games', createGame);
router.put('/games/:id', updateGame);
router.delete('/games/:id', deleteGame);

module.exports = router;
