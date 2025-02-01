import Video from '../models/video.model.js';
import { publishMessage } from '../services/amqplib.service.js';

export const uploadVideo = async (req, res) => {
    try {

        const { title, description } = req.body;
        const videoFile = req.file;
        const userId = req.headers['x-user-id']; 

        if (!videoFile) {
            return res.status(400).json({ error: 'No video file uploaded' });
        }

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: User ID missing' });
        }

        // video url 
        const videoUrl = `/uploads/${videoFile.filename}`;
        const thumbnailUrl = ''; 

        //video creation
        const video = await Video.create({ userId, title, description, videoUrl, thumbnailUrl });
        res.status(201).json(video);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error uploading the video' });
    }
};


export const getVideos = async (req, res) => {
    try {
        const videos = await Video.findAll();
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving videos' });
    }
};

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

export const interactWithVideo = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const videoId = req.params.id;
        const actionType = req.body.actionType;  
        const watchTime = req.body.watchTime || 0; 

        if (!['like', 'watch', 'share'].includes(actionType)) {
            return res.status(400).json({ error: 'Invalid action type' });
        }

        const interaction = {
            userId,
            videoId,
            actionType,
            watchTime
        };

        await publishMessage('interactions_exchange', 'interaction.new', interaction);
        console.log('Interaction published:', interaction);

        res.status(200).json({ message: 'Interaction recorded and sent' });

        if (actionType === 'like') {
            await Video.increment('likesCount', { where: { id: videoId } });
        }else if (actionType === 'watch') {
            await Video.increment('viewsCount', { where: { id: videoId } });
        }else if (actionType === 'share'){
            await Video.increment('sharesCount', { where: { id: videoId } });
        }


    } catch (error) {
        console.error('Error processing interaction:', error);
        res.status(500).json({ error: 'Error processing interaction' });
    }
};

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