import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../service/api';
import './VideoDetail.css';

const VideoDetail = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        // Utilisez l'instance `api` pour effectuer la requête
        const response = await api.get(`/videos/${videoId}`);
        setVideo(response.data);
      } catch (error) {
        console.error('Error fetching video details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (loading) return <div>Loading...</div>;
  if (!video) return <div>Video not found</div>;

  return (
    <div className="video-detail">
      <div className="video-section">
        <video controls src={video.videoUrl} />
      </div>
      <div className="info-section">
        <div className="video-info">
          <h2>{video.title}</h2>
          <p>{video.description}</p>
          <div className="user-info">
            <img src={video.userAvatar || '/default-avatar.png'} alt={video.username} />
            <span>{video.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
