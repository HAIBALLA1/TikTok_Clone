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


router.post('/upload-url', generateUploadUrl);

router.post('/save-metadata', saveVideoMetadata);


router.get('/', getVideos);          
router.get('/:id', getVideoById);    
router.get('/batch', getVideosByIds); 

router.post('/:id/interact', interactWithVideo);

router.put('/:id', updateVideo);      
router.delete('/:id', deleteVideo);   

export default router;
