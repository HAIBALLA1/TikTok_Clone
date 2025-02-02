import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import VideoCard from '../../components/VideoCard/VideoCard';
import api from '../../service/api'; 
import './Home.css';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const userId = "user123"; 

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Appel au recommender-service via l'API Gateway
        const recResponse = await api.get(`/api/recommendations/${userId}`);
        // Supposons que la réponse est { userId, recommendations: [ { videoId, combinedScore }, ... ] }
        const recommendedIds = recResponse.data.recommendations.map(rec => rec.videoId);

        // Ensuite, on appelle le video-service pour obtenir les métadonnées complètes
        // Par exemple, le video-service pourrait exposer un endpoint /api/videos?ids=1,2,3
        const videoResponse = await api.get(`/api/videos?ids=${recommendedIds.join(',')}`);
        setVideos(videoResponse.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des recommandations :", error);
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
