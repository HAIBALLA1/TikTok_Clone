import React, { useState } from 'react';
import api from '../../service/api'; 
import { useAuth } from '../../context/AuthContext';
import './Upload.css';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user, token } = useAuth(); 

  console.log('User token:', token);
  const navigate = useNavigate();
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      alert('Please select a video to upload.');
      return;
    }

    // initialize formData
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', file);

    console.log('FormData Contents:');
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    setIsUploading(true);

    try {
      const response = await api.post('/videos', formData);
      console.log('Video uploaded successfully:', response.data);
      alert('Video uploaded successfully!');
      navigate('/videos');
      setTitle('');
      setDescription('');
      setFile(null);
    } catch (error) {
      console.error('Error uploading the video:', error);
      alert('Failed to upload the video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload a New Video</h2>
      <form className="upload-form" onSubmit={handleUpload}>
        <div className="form-group">
          <label htmlFor="title">Video Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Video Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter video description"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="video">Select Video</label>
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit" disabled={isUploading} className="upload-button">
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default Upload;
