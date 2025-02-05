import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
import Video from '../models/video.model.js';
import { publishMessage } from '../../amqplib.service.mjs';

dotenv.config(); // Load environment variables from a .env file

// Initialize S3 client with credentials and region from environment variables
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const MAX_FILE_SIZE = 500 * 1024 * 1024; // Define max file size (500MB)

// Generate a signed URL for uploading videos to S3
export const generateUploadUrl = async (req, res) => {
  try {
    const { fileName, fileType, fileSize } = req.body; // Extract request body parameters
    const userId = req.headers['x-user-id']; // Extract user ID from headers

    // Validate required parameters
    if (!userId || !fileName || !fileType || !fileSize) {
      return res.status(400).json({ error: "Missing required data" });
    }

    // Validate file type and size
    if (fileType.startsWith('video/') && fileSize > MAX_FILE_SIZE) {
      return res.status(400).json({ error: "File too large. Limit: 500MB" });
    }

    // Generate a unique key for the video in the S3 bucket
    const key = `videos/${userId}/${new Date().toISOString().split('T')[0]}/${Date.now()}-${fileName}`;

    // Prepare the S3 command to generate a signed URL
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      ContentType: fileType,
    });

    // Generate the signed URL with a 1-hour expiration time
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    res.status(200).json({ uploadUrl, key }); // Return the signed URL and key
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res.status(500).json({ error: "Error generating upload URL" });
  }
};

// Save video metadata (title, description, and key) to the database
export const saveVideoMetadata = async (req, res) => {
  try {
    const { title, description, key } = req.body; // Extract metadata from request body
    const userId = req.headers['x-user-id']; // Extract user ID from headers

    // Validate required parameters
    if (!userId || !title || !key) {
      return res.status(400).json({ error: "Missing required data" });
    }

    // Construct the full video URL using the S3 bucket and key
    const videoUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    // Save metadata to the database
    const video = await Video.create({ userId, title, description, videoUrl });
    res.status(201).json(video); // Return the created video metadata
  } catch (error) {
    console.error("Error saving video metadata:", error);
    res.status(500).json({ error: "Error saving metadata" });
  }
};

// Retrieve all videos from the database
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.findAll();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving videos' });
  }
};

// Retrieve a specific video by its ID
export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params; // Extract video ID from URL parameters
    const video = await Video.findByPk(id);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving the video' });
  }
};

// Retrieve multiple videos by their IDs
export const getVideosByIds = async (req, res) => {
  try {
    const { ids } = req.query; // Extract IDs from query parameters
    if (!ids) {
      return res.status(400).json({ error: "The 'ids' parameter is required" });
    }

    // Parse IDs into an array of integers
    const idsArray = ids.split(',').map(id => parseInt(id, 10)).filter(num => !isNaN(num));
    if (idsArray.length === 0) {
      return res.status(400).json({ error: 'No valid IDs provided' });
    }

    const videos = await Video.findAll({ where: { id: idsArray } }); // Query videos by IDs
    res.status(200).json(videos);
  } catch (error) {
    console.error("Error retrieving videos by IDs:", error);
    res.status(500).json({ error: "Error retrieving videos by IDs" });
  }
};

// Record interactions with videos (e.g., like, watch, share)
export const interactWithVideo = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const videoId = req.params.id;
    const actionType = req.body.actionType;
    const watchTime = req.body.watchTime || 0;

    // Validate the action type
    if (!['like', 'watch', 'share'].includes(actionType)) {
      return res.status(400).json({ error: 'Invalid action type' });
    }

    // Publish interaction details to the message queue
    const interaction = { userId, videoId, actionType, watchTime };
    await publishMessage('interactions_exchange', 'interaction.new', interaction);
    console.log('Interaction published:', interaction);

    res.status(200).json({ message: 'Interaction recorded and sent' });

    // Increment counts in the database based on action type
    if (actionType === 'like') {
      await Video.increment('likesCount', { where: { id: videoId } });
    } else if (actionType === 'watch') {
      await Video.increment('viewsCount', { where: { id: videoId } });
    } else if (actionType === 'share') {
      await Video.increment('sharesCount', { where: { id: videoId } });
    }
  } catch (error) {
    console.error('Error handling interaction:', error);
    res.status(500).json({ error: 'Error handling interaction' });
  }
};

// Update a video's metadata
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params; // Extract video ID from URL parameters
    const updated = await Video.update(req.body, { where: { id } });
    if (!updated[0]) return res.status(404).json({ error: 'Video not found' });
    res.status(200).json({ message: 'Video updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating the video' });
  }
};

// Delete a video by ID
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params; // Extract video ID from URL parameters
    const deleted = await Video.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Video not found' });
    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the video' });
  }
};
