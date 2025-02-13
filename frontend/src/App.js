import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GameList from './GameList';
import AddGame from './AddGame';
import FetchGame from './FetchGame';
import DeleteGame from './DeleteGame';

const Home = () => (
  <div>
    <h1>Game Management</h1>
    <nav>
      <ul>
        <li><Link to="/games">View Games</Link></li>
        <li><Link to="/add-game">Add Game</Link></li>
        <li><Link to="/fetch-game">Fetch & Store Game</Link></li>
        <li><Link to="/delete-game">Delete Game</Link></li>
      </ul>
    </nav>
  </div>
);

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/games" element={<GameList />} />
      <Route path="/add-game" element={<AddGame />} />
      <Route path="/fetch-game" element={<FetchGame />} />
      <Route path="/delete-game" element={<DeleteGame />} />
    </Routes>
  </Router>
);

export default App;
