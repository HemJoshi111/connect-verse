import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please enter a valid email",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false, // IMPORTANT: When we query for a user, don't return the password by default
        },
        profilePicture: {
            type: String,
            default: "", // We will store the URL from Cloudinary here later
        },
        bio: {
            type: String,
            default: "",
            maxlength: 150,
        },
        followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }// Automatically creates 'createdAt' and 'updatedAt' fields
);

// --- Middleware: Encrypt password using bcrypt before saving ---

userSchema.pre("save", async function (req, res, next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);

    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt)
})

// --- Method: Compare entered password with hashed password ---

userSchema.methods.matchPassword = async function (enteredPassword) {

    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;
