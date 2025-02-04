import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
import Video from '../models/video.model.js';
import { publishMessage } from '../../amqplib.service.mjs';

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

// Taille max : 500MB
const MAX_FILE_SIZE = 500 * 1024 * 1024;

/**
 * Génère une URL signée pour l'upload direct vers S3.
 */
export const generateUploadUrl = async (req, res) => {
  try {
    const { fileName, fileType, fileSize } = req.body;
    const userId = req.headers['x-user-id'];

    if (!userId || !fileName || !fileType || !fileSize) {
      return res.status(400).json({ error: "Données manquantes" });
    }

    if (fileType.startsWith('video/') && fileSize > MAX_FILE_SIZE) {
      return res.status(400).json({ error: "Fichier trop volumineux. Limite : 500MB" });
    }

    // Organisation des fichiers : par utilisateur et date
    const key = `videos/${userId}/${new Date().toISOString().split('T')[0]}/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    res.status(200).json({ uploadUrl, key });
  } catch (error) {
    console.error("Erreur lors de la génération de l'URL signée:", error);
    res.status(500).json({ error: "Erreur lors de la génération de l'URL" });
  }
};

/**
 * Enregistre les métadonnées d'une vidéo après upload sur S3.
 */
export const saveVideoMetadata = async (req, res) => {
  try {
    const { title, description, key } = req.body;
    const userId = req.headers['x-user-id'];

    if (!userId || !title || !key) {
      return res.status(400).json({ error: "Données manquantes" });
    }

    const videoUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    const video = await Video.create({ userId, title, description, videoUrl });
    res.status(201).json(video);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des métadonnées:", error);
    res.status(500).json({ error: "Erreur lors de l'enregistrement" });
  }
};

/**
 * Récupère toutes les vidéos disponibles.
 */
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.findAll();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des vidéos' });
  }
};

/**
 * Récupère une vidéo par son ID.
 */
export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByPk(id);
    if (!video) return res.status(404).json({ error: 'Vidéo non trouvée' });
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la vidéo' });
  }
};

/**
 * Récupère plusieurs vidéos par ID.
 */
export const getVideosByIds = async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({ error: "Le paramètre 'ids' est requis" });
    }
    const idsArray = ids.split(',').map(id => parseInt(id, 10)).filter(num => !isNaN(num));
    if (idsArray.length === 0) {
      return res.status(400).json({ error: 'Aucun ID valide fourni' });
    }
    const videos = await Video.findAll({ where: { id: idsArray } });
    res.status(200).json(videos);
  } catch (error) {
    console.error("Erreur lors de la récupération des vidéos par ID :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des vidéos par ID" });
  }
};

/**
 * Enregistre les interactions (like, watch, share) avec une vidéo.
 */
export const interactWithVideo = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const videoId = req.params.id;
    const actionType = req.body.actionType;
    const watchTime = req.body.watchTime || 0;

    if (!['like', 'watch', 'share'].includes(actionType)) {
      return res.status(400).json({ error: 'Type d\'action invalide' });
    }

    const interaction = { userId, videoId, actionType, watchTime };
    await publishMessage('interactions_exchange', 'interaction.new', interaction);
    console.log('Interaction publiée :', interaction);

    res.status(200).json({ message: 'Interaction enregistrée et envoyée' });

    if (actionType === 'like') {
      await Video.increment('likesCount', { where: { id: videoId } });
    } else if (actionType === 'watch') {
      await Video.increment('viewsCount', { where: { id: videoId } });
    } else if (actionType === 'share') {
      await Video.increment('sharesCount', { where: { id: videoId } });
    }
  } catch (error) {
    console.error('Erreur lors du traitement de l\'interaction :', error);
    res.status(500).json({ error: 'Erreur lors du traitement de l\'interaction' });
  }
};

/**
 * Met à jour les informations d'une vidéo.
 */
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Video.update(req.body, { where: { id } });
    if (!updated[0]) return res.status(404).json({ error: 'Vidéo non trouvée' });
    res.status(200).json({ message: 'Vidéo mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la vidéo' });
  }
};

/**
 * Supprime une vidéo par son ID.
 */
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Video.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Vidéo non trouvée' });
    res.status(200).json({ message: 'Vidéo supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la vidéo' });
  }
};
