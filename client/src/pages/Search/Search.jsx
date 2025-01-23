import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import VideoCard from '../../components/VideoCard/VideoCard';
import './Search.css';

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    setLoading(true);
    // Implement search logic here
    setLoading(false);
  };

  return (
    <div className="search-page">
      <Header onSearch={handleSearch} />
      <div className="search-results">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          searchResults.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))
        )}
      </div>
    </div>
  );
};

export default Search;
