import express from 'express';
import { deleteUserProfile,registerUser, loginUser, getUserProfile ,updateUserProfile } from '../controllers/user.controllers.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.put('/profile',  updateUserProfile);

router.get('/profile',  getUserProfile);

router.delete('/profile',  deleteUserProfile);

export default router;