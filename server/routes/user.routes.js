import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js'; 
import { getUserProfile, updateUserProfile } from '../controllers/user.controller.js';

const router = express.Router();

// Get any user's profile
router.get('/:id', protect, getUserProfile);

// Update MY profile (Upload image)
router.put('/update', protect, upload.single('profilePicture'), updateUserProfile);

export default router;