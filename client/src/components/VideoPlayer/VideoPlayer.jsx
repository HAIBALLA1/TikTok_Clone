import React, { useRef, useState } from 'react';
import './VideoPlayer.css';

const VideoPlayer = ({ videoUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handleVideoPress = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        onClick={handleVideoPress}
        loop
        className="video-player__video"
        src={videoUrl}
      />
    </div>
  );
};

export default VideoPlayer; 