import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';

// components
import MyComponent from './components/MyComponent';
import NavBar from './components/NavBar';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        <NavBar />
        <div className="flex-grow">
          <Routes>
            <Route exact path="/" element={
              <div className="flex flex-col items-center">
                <h1 className="text-3xl text-red-500">Hello World!</h1>
                <MyComponent />
              </div>
            } />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;