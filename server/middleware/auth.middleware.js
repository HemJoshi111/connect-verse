import User from '../models/user.model.js'
import jwt from "jsonwebtoken"

export const protect = async (req, res, next) => {
    let token;


    // 1. Check if the header has "Authorization" and starts with "Bearer"
    // Format: "Bearer <token_string>"
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {

        try {
            // 2. Get token from header and remove "Bearer " string
            token = req.headers.authorization.split(' ')[1];


            // decoded will get id of the user, because during jwt.sign, it also encode the id of user
            let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            // 4. Find the user associated with this token
            req.user = await User.findById(decoded.id).select('-password');
            // Now, req.user will contain the details of user except password

            // 5. Move to the next middleware or controller
            next();

        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });

        }

    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};