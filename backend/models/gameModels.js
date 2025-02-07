const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: String,
  price: Number,
  storeID: String,
  releaseDate: Date
});

module.exports = mongoose.model('Game', gameSchema);
