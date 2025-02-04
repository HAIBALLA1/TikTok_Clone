import React, { useState } from 'react';
import api from '../../service/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Upload.css';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file || !title) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    setIsUploading(true);

    try {
      // 1️⃣ Demander une URL signée au backend
      const signResponse = await api.post('/videos/upload-url', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { uploadUrl, key } = signResponse.data;

      // 2️⃣ Uploader directement vers S3
      const s3Response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!s3Response.ok) throw new Error('Échec de l\'upload vers S3');

      // 3️⃣ Enregistrer les métadonnées dans la BDD
      await api.post('/videos/save-metadata', {
        title,
        description,
        key,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Vidéo uploadée avec succès !');
      navigate('/');
      setTitle('');
      setDescription('');
      setFile(null);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de l\'upload : ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Uploader une Vidéo</h2>
      <form className="upload-form" onSubmit={handleUpload}>
        <div className="form-group">
          <label htmlFor="title">Titre</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de la vidéo"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décris ta vidéo..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="video">Sélectionner une Vidéo</label>
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit" disabled={isUploading} className="upload-button">
          {isUploading ? 'Uploading...' : 'Uploader la Vidéo'}
        </button>
      </form>
    </div>
  );
};

export default Upload;
