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

        const { fullName, username, email, password } = req.body;
        let profilePicture = '';

        if (!fullName || !username || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please add all fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

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

        // 3. Create user with fullName
        const user = await User.create({
            fullName,
            username,
            email,
            password,
            profilePicture,
        });

        if (user) {
            const userData = {
                _id: user._id,
                fullName: user.fullName,
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


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            const userData = {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                following: user.following,
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

export const getMe = async (req, res) => {
    try {
        const user = req.user;

        res.status(200).json({
            success: true,
            data: user // Just return the whole user object (minus password)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};