import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cloudinary from '../config/cloudinary.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let profilePicture = '';

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please add all fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // --- Handle Profile Picture Upload ---
        if (req.file) {
            const uploadToCloudinary = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: 'auto' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    stream.end(req.file.buffer);
                });
            };

            const result = await uploadToCloudinary();
            profilePicture = result.secure_url;
        }

        const user = await User.create({
            username,
            email,
            password,
            profilePicture, // Save the URL
        });

        if (user) {
            const userData = {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            };

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: userData,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Authenticate a user (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            const userData = {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                following: user.following, // Add these to keep context updated
                followers: user.followers
            };

            res.json({
                success: true,
                message: "Login successful",
                data: userData,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user data (Profile)
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                following: user.following,
                followers: user.followers
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};