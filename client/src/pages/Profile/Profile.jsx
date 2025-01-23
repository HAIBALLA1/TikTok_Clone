import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './Profile.css';

const Profile = () => {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userVideos, setUserVideos] = useState([]);

  useEffect(() => {
    // Fetch user profile and videos
  }, [username]);

  if (!userProfile) return <div>Loading...</div>;

  return (
    <div className="profile">
      <Header />
      <div className="profile-header">
        <img 
          src={userProfile.avatar} 
          alt={userProfile.username} 
          className="profile-avatar"
        />
        <div className="profile-info">
          <h2>{userProfile.username}</h2>
          <div className="stats">
            <span>{userProfile.followers} followers</span>
            <span>{userProfile.following} following</span>
            <span>{userProfile.likes} likes</span>
          </div>
          <p className="bio">{userProfile.bio}</p>
        </div>
      </div>
      <div className="profile-videos">
        {userVideos.map((video) => (
          <div key={video.id} className="video-thumbnail">
            <video src={video.videoUrl} />
            <span className="views">{video.views} views</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
