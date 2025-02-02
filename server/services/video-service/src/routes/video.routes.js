import express from 'express';
import { 
  uploadVideo, 
  generateUploadUrl, 
  getVideos, 
  getVideoById, 
  getVideosByIds, 
  interactWithVideo, 
  updateVideo, 
  deleteVideo 
} from '../controllers/video.controller.js';

const router = express.Router();

router.post('/', uploadVideo);
router.post('/upload-url', generateUploadUrl);
router.get('/', getVideos);
router.get('/:id', getVideoById);
router.get('/by-ids', getVideosByIds);
router.post('/:id/interact', interactWithVideo);
router.put('/:id', updateVideo);
router.delete('/:id', deleteVideo);

export default router;
