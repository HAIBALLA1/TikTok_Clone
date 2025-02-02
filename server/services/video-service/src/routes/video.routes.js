import express from 'express';
import multer from 'multer';
import { uploadVideo, getVideos, getVideosByIds, getVideoById, updateVideo, deleteVideo ,interactWithVideo } from '../controllers/video.controller.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
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
router.get('/by-ids', getVideosByIds);

router.post('/:id/interact', interactWithVideo);

export default router;
