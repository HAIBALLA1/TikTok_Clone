import Video from '../models/video.model.js';

export const uploadVideo = async (req, res) => {
    try {
        console.log('[Video Service] Requête reçue');
        console.log('[Video Service] x-user-id reçu :', req.headers['x-user-id']);

        const { title, description } = req.body;
        const videoFile = req.file;
        const userId = req.headers['x-user-id']; // Récupère l'ID utilisateur depuis les en-têtes

        if (!videoFile) {
            return res.status(400).json({ error: 'No video file uploaded' });
        }

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: User ID missing' });
        }

        // Construire l'URL de la vidéo
        const videoUrl = `/uploads/${videoFile.filename}`;
        const thumbnailUrl = ''; // Vous pouvez implémenter la génération de miniatures ici

        // Créer l'entrée vidéo dans la base de données
        const video = await Video.create({ userId, title, description, videoUrl, thumbnailUrl });
        res.status(201).json(video);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error uploading video' });
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