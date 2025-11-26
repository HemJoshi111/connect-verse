import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';
import { getUserProfile, updateUserProfile, followUnfollowUser, searchUsers } from '../controllers/user.controller.js';

const router = express.Router();

// Get any user's profile
router.get('/:id', protect, getUserProfile);

// Update MY profile (Upload image)
router.put('/update', protect, upload.single('profilePicture'), updateUserProfile);

router.post('/follow/:id', protect, followUnfollowUser);

// Search Route
router.get('/search/:query', protect, searchUsers);

export default router;