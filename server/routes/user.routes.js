import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';
import {
    getUserProfile, updateUserProfile, followUnfollowUser, searchUsers,
    getUserConnections
} from '../controllers/user.controller.js';

const router = express.Router();


// Search Route
router.get('/search/:query', protect, searchUsers);

//get followes and following
router.get('/connections', protect, getUserConnections);

// Get any user's profile
router.get('/:id', protect, getUserProfile);

// Update MY profile (Upload image)
router.put('/update', protect, upload.single('profilePicture'), updateUserProfile);



router.post('/follow/:id', protect, followUnfollowUser);


export default router;