const axios = require('axios');
require('dotenv').config(); // Load environment variables

const fetchGameFromAPI = async (gameId) => {
  try {
    const apiUrl = `${process.env.CHEAPSHARK_API}&id=${gameId}`; // Use env variable
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching game data:', error);
    return null;
  }
};

module.exports = { fetchGameFromAPI };
