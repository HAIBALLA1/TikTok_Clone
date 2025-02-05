import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import VideoCard from '../../components/VideoCard/VideoCard';
import api from '../../service/api';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth(); 
  const { userEmail } = useAuth(); 
  const [videos, setVideos] = useState([]);
  console.log('AuthContext userEmail:', userEmail); 
  console.log('LocalStorage user data:', localStorage.getItem('user'));
 

  useEffect(() => {
    console.log('User from AuthContext:', user);
    if (!user || !user.email) {
      console.error('User email is undefined!');
      return;
    }

    const fetchRecommendations = async () => {
      try {
        // Fetch recommendations based on user email
        const recResponse = await api.get(`/api/recommendations/${user.email}`);
        const recommendedIds = recResponse.data.recommendations.map(rec => rec.videoId);
        console.log(recommendedIds);

        // Fetch videos based on recommended video IDs
        const videoResponse = await api.get(`/api/videos?ids=${recommendedIds.join(',')}`);
        setVideos(videoResponse.data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, [user]);

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
