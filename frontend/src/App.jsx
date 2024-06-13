import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
// components
import NavBar from './components/NavBar';
// pages
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ListMain from './pages/ListMain';
import DetailsPage from './pages/DetailsPage';
import AddListing from './pages/AddListing';
import DetailsListing from './pages/DetailsListing';

const App = () => {

  return (
    <Router>
      <div className="flex flex-col h-screen">
        <NavBar />
        <div className="flex-grow p-4">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/list" element={<ListMain />} />
            <Route path="/list/:id" element={<DetailsPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add" element={<AddListing />} />
            <Route path="/profile/listing/:id" element={<DetailsListing />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;