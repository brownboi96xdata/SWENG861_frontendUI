import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import GameList from './GameList';
import GameDetails from './GameDetails';
import AddGame from './AddGame';
import FetchGame from './FetchGame';
import UpdateGame from './UpdateGame';
import DeleteGame from './DeleteGame';

const Home = () => {
  const [searchId, setSearchId] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchId) {
      navigate(`/games/${searchId}`);
    }
  };

  return (
    <div>
      <h1>Game Management</h1>
      <nav>
        <ul>
          <li><Link to="/games">View All Games</Link></li>
          <li><Link to="/add-game">Add Game</Link></li>
          <li><Link to="/fetch-game">Fetch & Store Game</Link></li>
          <li><Link to="/delete-game">Delete All Game</Link></li>
        </ul>
      </nav>
      <h2>Search Game by ID</h2>
      <input
        type="text"
        placeholder="Enter Game ID"
        value={searchId}
        style={{ marginRight: '10px' }} 
        onChange={(e) => setSearchId(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <h2>Update Game by ID</h2>
      <input
        type="text"
        placeholder="Enter Game ID"
        value={searchId}
        style={{ marginRight: '10px' }} 
        onChange={(e) => setSearchId(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <h2>Delete Game by ID</h2>
      <input
        type="text"
        placeholder="Enter Game ID"
        value={searchId}
        style={{ marginRight: '10px' }} 
        onChange={(e) => setSearchId(e.target.value)}
      />
      <button onClick={handleSearch}>Delete</button>
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/games" element={<GameList />} />
      <Route path="/games/:id" element={<GameDetails />} />
      <Route path="/add-game" element={<AddGame />} />
      <Route path="/fetch-game" element={<FetchGame />} />
      <Route path="/delete-game" element={<DeleteGame />} />
    </Routes>
  </Router>
);

export default App;