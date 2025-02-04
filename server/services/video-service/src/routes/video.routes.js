import express from 'express';
import { 
  generateUploadUrl, 
  saveVideoMetadata, 
  getVideos, 
  getVideoById, 
  getVideosByIds, 
  interactWithVideo, 
  updateVideo, 
  deleteVideo 
} from '../controllers/video.controller.js';

const router = express.Router();

// 📌 Génération d'une URL signée pour l'upload direct vers S3
router.post('/upload-url', generateUploadUrl);

// 📌 Enregistrement des métadonnées après upload sur S3
router.post('/save-metadata', saveVideoMetadata);

// 📌 Récupération des vidéos
router.get('/', getVideos);          // Récupérer toutes les vidéos
router.get('/:id', getVideoById);     // Récupérer une vidéo par ID
router.get('/batch', getVideosByIds); // Récupérer plusieurs vidéos par IDs (query param: ?ids=1,2,3)

// 📌 Interactions avec les vidéos (like, watch, share)
router.post('/:id/interact', interactWithVideo);

// 📌 Mise à jour et suppression des vidéos
router.put('/:id', updateVideo);      // Mise à jour des informations d'une vidéo
router.delete('/:id', deleteVideo);   // Suppression d'une vidéo

export default router;
