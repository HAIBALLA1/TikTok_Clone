import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import VideoCard from '../../components/VideoCard/VideoCard';
import api from '../../service/api'; 
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
  const { userId } = useAuth();
  const [videos, setVideos] = useState([]);
   

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const recResponse = await api.get(`/api/recommendations/${userId}`);
        const recommendedIds = recResponse.data.recommendations.map(rec => rec.videoId);
        console.log(recommendedIds);

        const videoResponse = await api.get(`/api/videos?ids=${recommendedIds.join(',')}`);
        setVideos(videoResponse.data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, [userId]);

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
