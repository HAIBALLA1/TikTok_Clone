import Video from '../models/video.model.js';
import s3 from '../config/aws.js'; 
import multerS3 from 'multer-s3-v3'; 
import multer from 'multer';
import { publishMessage } from '../../amqplib.service.mjs';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// multer config for direct upload to S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    key: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  }),
  limits: { fileSize: 50 * 1024 * 1024 } // Limite à 50 Mo
}).single('video');

// generate signed url for direct upload from front
export const generateUploadUrl = async (req, res) => {
  try {
    const key = `${Date.now()}-${req.body.filename}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      ContentType: req.body.contentType,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // URL valable 1 heure
    res.status(200).json({ uploadUrl: url, key });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ error: 'Error generating upload URL' });
  }
};

// upload video
export const uploadVideo = (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        console.error('Error during upload:', err);
        return res.status(500).json({ error: 'Error uploading to S3' });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'No video file uploaded' });
      }
      console.log('File uploaded to S3:', req.file.location);
      
      const { title, description } = req.body;
      const userId = req.headers['x-user-id'];
      if (!userId) {
        return res.status(401).json({ error: 'User ID missing' });
      }
      
      
      res.status(202).json({ message: 'Video upload accepted, processing...' });
      
      // insert video in db
      setImmediate(async () => {
        try {
          await Video.create({ userId, title, description, videoUrl: req.file.location });
          console.log('Video successfully inserted in DB');
        } catch (error) {
          console.error('Error inserting video in DB:', error);
        }
      });
    });
  };
  
// get all videos
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.findAll();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving videos' });
  }
};

// get video by id
export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByPk(id);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving video' });
  }
};

// get videos by ids
export const getVideosByIds = async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({ error: "Query parameter 'ids' is required" });
    }
    const idsArray = ids.split(',').map(id => parseInt(id, 10)).filter(num => !isNaN(num));
    if (idsArray.length === 0) {
      return res.status(400).json({ error: "No valid ID provided" });
    }
    const videos = await Video.findAll({ where: { id: idsArray } });
    res.status(200).json(videos);
  } catch (error) {
    console.error("Error retrieving videos by IDs:", error);
    res.status(500).json({ error: "Error retrieving videos by IDs" });
  }
};

// interact with video
export const interactWithVideo = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const videoId = req.params.id;
    const actionType = req.body.actionType;
    const watchTime = req.body.watchTime || 0;
    if (!['like', 'watch', 'share'].includes(actionType)) {
      return res.status(400).json({ error: 'Invalid action type' });
    }
    const interaction = { userId, videoId, actionType, watchTime };
    await publishMessage('interactions_exchange', 'interaction.new', interaction);
    console.log('Interaction published:', interaction);
    res.status(200).json({ message: 'Interaction recorded and sent' });
    if (actionType === 'like') {
      await Video.increment('likesCount', { where: { id: videoId } });
    } else if (actionType === 'watch') {
      await Video.increment('viewsCount', { where: { id: videoId } });
    } else if (actionType === 'share') {
      await Video.increment('sharesCount', { where: { id: videoId } });
    }
  } catch (error) {
    console.error('Error processing interaction:', error);
    res.status(500).json({ error: 'Error processing interaction' });
  }
};

// update video
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Video.update(req.body, { where: { id } });
    if (!updated[0]) return res.status(404).json({ error: 'Video not found' });
    res.status(200).json({ message: 'Video updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating video' });
  }
};

// delete video
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Video.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Video not found' });
    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting video' });
  }
};
