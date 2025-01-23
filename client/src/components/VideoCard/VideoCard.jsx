import React from 'react';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import './VideoCard.css';

const VideoCard = ({ video }) => {
  return (
    <div className="video-card">
      <div className="video-player-container">
        <VideoPlayer videoUrl={video.videoUrl} />
      </div>
      
      {/* Sidebar avec les actions */}
      <div className="video-sidebar">
        <div className="sidebar-icon">
          <button className="action-button">
            <i className="fas fa-heart"></i>
            <span>{video.likes}</span>
          </button>
          <button className="action-button">
            <i className="fas fa-comment"></i>
            <span>{video.comments}</span>
          </button>
          <button className="action-button">
            <i className="fas fa-share"></i>
            <span>{video.shares}</span>
          </button>
        </div>
      </div>

      {/* Info utilisateur et description */}
      <div className="video-info">
        <div className="user-info">
          <img src={video.userAvatar} alt={video.username} className="user-avatar" />
          <span className="username">@{video.username}</span>
        </div>
        <p className="video-description">{video.caption}</p>
      </div>
    </div>
  );
};

export default VideoCard;