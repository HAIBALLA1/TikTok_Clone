import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../service/api';
import Header from '../../components/Header/Header';
import './Profile.css';

const Profile = () => {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userVideos, setUserVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {

      try {
        // Fetch user profile data
        const profileResponse = await api.get(`/users/profile`);
        console.log('Profile response:', profileResponse.data);
        setUserProfile(profileResponse.data);

        // Fetch user videos
        const videosResponse = await api.get(`/videos?user=${profileResponse.data.username}`);
        console.log('Videos response:', videosResponse.data);
        setUserVideos(videosResponse.data);
      } catch (error) {
        console.error('Error fetching profile or videos:', error);
        if (error.response?.status === 404) {
          navigate('/404'); 
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, navigate]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!userProfile) return <div className="error">User not found</div>;

  return (
    <div className="profile" style={{ paddingTop: '80px' }}>
      <Header />
      <div className="profile-header">
        <img
          src={userProfile.avatar || '/default-avatar.png'} // Default avatar if not provided
          alt={userProfile.username}
          className="profile-avatar"
        />
        <div className="profile-info">
          <h2>{userProfile.username}</h2>
          <div className="stats">
            <span>
              <i className="fas fa-user"></i> {userProfile.followers} followers
            </span>
            <span>
              <i className="fas fa-heart"></i> {userProfile.likes} likes
            </span>
            <span>
              <i className="fas fa-user-friends"></i> {userProfile.following} following
            </span>
          </div>
          <p className="bio">{userProfile.bio || 'No bio available.'}</p>
        </div>
      </div>

      <div className="profile-videos">
        {userVideos.length > 0 ? (
          userVideos.map((video) => (
            <div
              key={video.id}
              className="video-thumbnail"
              onClick={() => navigate(`/video/${video.id}`)}
            >
              <video src={video.videoUrl} />
              <span className="views">
                <i className="fas fa-eye"></i> {video.views} views
              </span>
            </div>
          ))
        ) : (
          <div className="no-videos">No videos uploaded yet.</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
