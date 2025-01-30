import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <Link to="/" className="header__logo">
          <img src="/logo.png" alt="TikTok" className="header__logo-img" />
        </Link>

        {/* Main navigation */}
        <nav className="header__nav">
          <Link to="/" className={`nav__button ${location.pathname === '/' ? 'active' : ''}`}>
            For You
          </Link>
          <Link to="/following" className={`nav__button ${location.pathname === '/following' ? 'active' : ''}`}>
            Following
          </Link>
          <Link to="/live" className={`nav__button ${location.pathname === '/live' ? 'active' : ''}`}>
            LIVE
          </Link>
        </nav>

        {/* Search bar */}
        <form className="header__search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search accounts and videos"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search__input"
          />
          <button type="submit" className="search__button">
            <i className="fas fa-search"></i>
          </button>
        </form>

        {/* Actions */}
        <div className="header__actions">
          <Link to="/upload" className="action__button upload">
            <i className="fas fa-plus"></i> Upload
          </Link>
          {user ? (
            <div className="profile-menu">
              <Link to={`/profile/`} className="profile-link">
                <img
                  src={user.avatar || '/default-avatar.png'}
                  alt="Profile"
                  className="profile-avatar"
                />
              </Link>
              <button onClick={logout} className="logout-button">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="action__button login">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
