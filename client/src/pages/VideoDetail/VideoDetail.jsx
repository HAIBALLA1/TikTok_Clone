import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import CommentSection from '../../components/Comments/CommentSection';
import './VideoDetail.css';

const VideoDetail = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    // Fetch video details
  }, [videoId]);

  if (!video) return <div>Loading...</div>;

  return (
    <div className="video-detail">
      <div className="video-section">
        <VideoPlayer videoUrl={video.videoUrl} />
      </div>
      <div className="info-section">
        <div className="video-info">
          <h2>{video.caption}</h2>
          <div className="user-info">
            <img src={video.userAvatar} alt={video.username} />
            <span>{video.username}</span>
          </div>
        </div>
        <CommentSection videoId={videoId} />
      </div>
    </div>
  );
};

export default VideoDetail;