import mongoose, { Schema } from "mongoose"

const postSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    img: {
        type: String, // URL from Cloudinary
    },

    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],

    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            text: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now()
            }
        },
    ]

}, { timestamps: true })

const Post = mongoose.model("Post", postSchema);
export default Post;