import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import VideoCard from '../../components/VideoCard/VideoCard';
import './Home.css';

const Home = () => {
  const [videos, setVideos] = useState([
    {
      id: 1,
      username: "user123",
      userAvatar: "/path/to/avatar.jpg",
      videoUrl: "/path/to/video.mp4",
      caption: "This is my first video! #fun #trending",
      likes: 1234,
      comments: 321,
      shares: 55
    },
    // Ajoutez plus de vidéos ici
  ]);

  return (
    <div className="home">
      <Header />
      <div className="videos-feed">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default Home;