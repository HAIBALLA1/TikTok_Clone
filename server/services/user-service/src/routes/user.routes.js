import express from 'express';
import { deleteUserProfile,registerUser, loginUser, getUserProfile ,updateUserProfile } from '../controllers/user.controllers.js';

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route for user profile update
router.put('/profile',  updateUserProfile);

// Route for user profile (protected)
router.get('/profile',  getUserProfile);

router.delete('/profile',  deleteUserProfile);
export default router;