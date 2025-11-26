import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Create a new post
// @route   POST /api/posts/create
// @access  Private
export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let imgUrl = '';

        if (!text && !req.file) {
            return res.status(400).json({
                success: false,
                message: 'Post must contain text or an image'
            });
        }

        if (req.file) {
            const uploadToCloudinary = () => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { resource_type: 'auto' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(req.file.buffer);
                });
            };

            const result = await uploadToCloudinary();
            imgUrl = result.secure_url;
        }

        const newPost = new Post({
            user: req.user._id,
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
// @access  Private
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({
                path: 'user',
                select: '-password'
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
// @access  Private
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
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this post' });
        }

        if (post.img) {
            // Optional: Delete image from Cloudinary here if you want
            // const imgId = post.img.split('/').pop().split('.')[0];
            // await cloudinary.uploader.destroy(imgId);
        }

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

        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            // Unlike
            await Post.updateOne({ _id: id }, { $pull: { likes: userId } });
            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
            res.status(200).json(updatedLikes);
        } else {
            // Like
            post.likes.push(userId);
            await post.save();

            // --- NOTIFICATION LOGIC START ---
            // Create notification only if liking someone else's post
            if (post.user.toString() !== userId.toString()) {
                const notification = new Notification({
                    from: userId,
                    to: post.user,
                    type: 'like'
                });
                await notification.save();
            }
            // --- NOTIFICATION LOGIC END ---

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

        // --- NOTIFICATION LOGIC START ---
        if (post.user.toString() !== userId.toString()) {
            const notification = new Notification({
                from: userId,
                to: post.user,
                type: 'comment'
            });
            await notification.save();
        }
        // --- NOTIFICATION LOGIC END ---

        res.status(200).json(post.comments);
    } catch (error) {
        console.log('Error in commentOnPost:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};