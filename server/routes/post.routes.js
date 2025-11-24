import express from "express";
import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js'; // The Multer config
import {
    createPost,
    getAllPosts,
    getUserPosts,
    deletePost
} from '../controllers/post.controller.js';

const router = express.Router();

// @route   POST /api/posts/create
// @desc    Create a new post with image
// @access  Private
// Flow: Check Token -> Check/Process File -> Run Controller Logic
router.post('/create', protect, upload.single('img'), createPost);

// Route: GET /api/posts/all
// only logged-in users can see the feed. 
router.get('/all', protect, getAllPosts);

router.get('/user/:id', protect, getUserPosts); // Get specific user's posts
router.delete('/:id', protect, deletePost);     // Delete a post by ID

export default router;