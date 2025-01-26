// routes/video.routes.js
import express from 'express';
import multer from 'multer';
import { uploadVideo, getVideos, getVideoById, updateVideo, deleteVideo } from '../controllers/video.controller.js';

const router = express.Router();

// Configurer Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Assurez-vous que ce dossier existe
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Routes
router.post('/', upload.single('video'), uploadVideo);
router.get('/', getVideos);
router.get('/:id', getVideoById);
router.put('/:id', updateVideo);
router.delete('/:id', deleteVideo);

export default router;
