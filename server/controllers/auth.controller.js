import User from "../models/user.model.js"
import jwt from "jsonwebtoken"



//function to generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });
}

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. check if all fields exist
        if (!username || !email || !password) {

            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }

        // 2. check if user already exists
        const userEmailExists = await User.findOne({ email });
        if (userEmailExists) {
            return res
                .status(400)
                .json({ success: false, message: "User already exists" });
        }

        const userUsernameExists = await User.findOne({ username });
        if (userUsernameExists) {
            return res
                .status(400)
                .json({ success: false, message: "User already exists" });
        }

        // 3. Create user (Password hashing is handled in user.model.js pre-save hook)
        const user = await User.create({
            username, email, password,
        })

        if (user) {

            // 1. Create the clean Data Object (DTO) explicitly
            const userData = {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            };

            res.status(201).json({
                success: true,
                data: userData,
                message: "User registered successfully",
                token: generateToken(user._id),
            })
        } else {
            res.status(400).json({ success: false, message: "Invalid user data" });
        }

    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });

    }
}


// @desc    Authenticate a user (Login)
// @route   POST /api/auth/login
// @access  Public

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //1. check for user
        const user = await User.findOne({ email }).select('+password')
        // We used select: false in model, so we must explicitly ask for password here to compare

        // check for password

        if (user && (await user.matchPassword(password))) {

            const userData = {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            };

            res.status(200).json({
                message: "Login Successful",
                success: true,
                data: userData,
                token: generateToken(user._id),
            })
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (err) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// @desc    Get user data (Profile)
// @route   GET /api/auth/me
// @access  Private

export const getMe = async (req, res) => {
    try {

        // req.user will be set by our auth middleware
        const user = await User.findById(req.user._id);

        // OPTIMIZATION Method: Use the user already fetched by the middleware
        //const user = req.user;

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false, message: errror.message,
        })

    }
}