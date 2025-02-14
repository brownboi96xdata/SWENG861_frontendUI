import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AddGames = () => {
  const [formData, setFormData] = useState({
    title: '',
    gameID: '',
    thumb: '',
    cheapestPrice: '',
    deals: [{ storeID: '', price: '' }]
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  //const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDealChange = (index, e) => {
    const newDeals = formData.deals.map((deal, i) => (
      i === index ? { ...deal, [e.target.name]: e.target.value } : deal
    ));
    setFormData({ ...formData, deals: newDeals });
  };

  const addDeal = () => {
    setFormData({
      ...formData,
      deals: [...formData.deals, { storeID: '', price: '' }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    //setSuccessMessage('');

    try {
      const response = await axios.post(`${API_BASE_URL}/games`, formData);

      if (response.data.error) {
        setErrors(response.data.message);
      } else {
        alert('Game added successfully!');
        setFormData({
          title: '',
          gameID: '',
          thumb: '',
          cheapestPrice: '',
          deals: [{ storeID: '', price: '' }]
        });
      }
    } catch (error) {
      alert('Failed to add game. Please try again later.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Add a New Game</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title: </label><br />
          <input
            type="text"
            name="title"
            style={{ width: '500px'}}
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          {errors.title && <div className="text-red-500">{errors.title}</div>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Game ID: </label><br />
          <input
            type="text"
            name="gameID"
            value={formData.gameID}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          {errors.gameID && <div className="text-red-500">{errors.gameID}</div>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Thumb: </label><br />
          <input
            type="text"
            name="thumb"
            style={{ width: '500px'}}
            value={formData.thumb}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          {errors.thumb && <div className="text-red-500">{errors.thumb}</div>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Cheapest Price: </label><br />
          <input
            type="text"
            name="cheapestPrice"
            value={formData.cheapestPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded mb-4"
          />
          {errors.cheapestPrice && <div className="text-red-500">{errors.cheapestPrice}</div>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Deals:</label><br />
          {formData.deals.map((deal, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                name="storeID"
                placeholder="Store ID"
                value={deal.storeID}
                onChange={(e) => handleDealChange(index, e)}
                className="w-full px-3 py-2 border rounded mb-2"
              />
              <input
                type="text"
                name="price"
                placeholder="Price"
                value={deal.price}
                onChange={(e) => handleDealChange(index, e)}
                className="w-full px-3 py-2 border rounded mb-4"
              />
            </div>
          ))}
          <button type="button" onClick={addDeal} className="bg-gray-500 text-white px-4 py-2 rounded mb-4">
            Add Deal
          </button>
        </div>
        <br /> <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Game
        </button>
      </form>
      <br /><button onClick={() => navigate('/')}>Home</button>
    </div>
  );
};

export default AddGames;