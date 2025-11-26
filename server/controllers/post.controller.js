import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Create a new post
// @route   POST /api/posts/create
// @access  Private
export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let imgUrl = '';

        // 1. Check if neither text nor image is provided
        if (!text && !req.file) {
            return res.status(400).json({
                success: false,
                message: 'Post must contain text or an image'
            });
        }

        // 2. Handle Image Upload (If exists)
        if (req.file) {
            // We need to wrap Cloudinary's upload_stream in a Promise 
            // because it uses callbacks by default, but we want async/await.
            const uploadToCloudinary = () => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { resource_type: 'auto' }, // auto detects jpg, png, etc.
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result); // result contains the secure_url
                            }
                        }
                    );
                    // Write the buffer to the stream to start upload
                    uploadStream.end(req.file.buffer);
                });
            };

            const result = await uploadToCloudinary();
            imgUrl = result.secure_url; // Get the URL of the uploaded image
        }

        // 3. Create Post in Database
        const newPost = new Post({
            user: req.user._id, // Got from auth middleware
            text,
            img: imgUrl,
        });

        await newPost.save();

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: newPost,
        });

    } catch (error) {
        console.log('Error in createPost:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all posts
// @route   GET /api/posts/all
// @access  Public (or Private, depending on preference)
export const getAllPosts = async (req, res) => {
    try {
        // 1. Find all posts
        // 2. .sort({ createdAt: -1 }): Sort by Date. -1 means Descending (Newest first).
        // 3. .populate(...): Replace the 'user' ID with actual user data (username, img)
        //    We also populate 'comments.user' to see who commented.
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({
                path: 'user',
                select: '-password' // Don't send the password!
            })
            .populate({
                path: 'comments.user',
                select: '-password'
            });

        if (posts.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(posts);
    } catch (error) {
        console.log('Error in getAllPosts:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get posts by a specific user
// @route   GET /api/posts/user/:id
// @access  Public
export const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.id })
            .sort({ createdAt: -1 })
            .populate('user', '-password')
            .populate('comments.user', '-password');

        res.status(200).json(posts);
    } catch (error) {
        console.log('Error in getUserPosts:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
    try {
        // 1. Find the post by ID
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // 2. Check ownership: Is the logged-in user the owner of the post?
        // Note: post.user is an ObjectId, req.user._id is a String (or ObjectId).
        // We must convert to strings to compare them accurately.
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this post' });
        }

        // 3. Delete from Database
        // (Optional:  would also delete the image from Cloudinary here)
        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: 'Post deleted successfully' });

    } catch (error) {
        console.log('Error in deletePost:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Like or Unlike a post
// @route   POST /api/posts/like/:id
// @access  Private
export const likeUnlikePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Check if user already liked the post
        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            // Unlike: Remove userId from likes array
            // $pull is a MongoDB operator to remove items from an array
            await Post.updateOne({ _id: id }, { $pull: { likes: userId } });

            // We return the updated list of likes to the frontend
            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
            res.status(200).json(updatedLikes);
        } else {
            // Like: Push userId to likes array
            post.likes.push(userId);
            await post.save();

            // Send notification (TODO: Feature for later)

            res.status(200).json(post.likes);
        }
    } catch (error) {
        console.log('Error in likeUnlikePost:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Comment on a post
// @route   POST /api/posts/comment/:id
// @access  Private
export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if (!text) {
            return res.status(400).json({ success: false, message: 'Text is required' });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const comment = {
            user: userId,
            text,
        };

        post.comments.push(comment);
        await post.save();

        res.status(200).json(post.comments); // Return updated comments
    } catch (error) {
        console.log('Error in commentOnPost:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

