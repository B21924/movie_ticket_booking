// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AddMovie from './pages/AddMovie';
import BookMovie from './pages/BookMovie';
import './App.css';

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-movie" element={<AddMovie />} />
          <Route path="/book/:movieId" element={<BookMovie />} />
        </Routes>
    </Router>
  );
};

export default App;
