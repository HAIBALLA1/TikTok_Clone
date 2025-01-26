import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import des pages
import Header from './components/Header/Header';

import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import VideoDetail from './pages/VideoDetail/VideoDetail';
import Profile from './pages/Profile/Profile';
import Following from './pages/Following/Following';
import Live from './pages/Live/Live';
import Upload from './pages/Upload/Upload';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/video/:videoId" element={<VideoDetail />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/following" element={<Following />} />
          <Route path="/live" element={<Live />} />
          
          {/* Routes d'authentification */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Route protégée */}
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
