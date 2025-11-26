import { baseUrl } from '../utils/url';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Trash2, Send } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Post = ({ post, onDelete }) => {
    const { authUser } = useAuthContext();

    // Local State for instant UI updates
    const [likes, setLikes] = useState(post.likes);
    const [isLiked, setIsLiked] = useState(post.likes.includes(authUser?._id));
    const [comments, setComments] = useState(post.comments);

    // Comment Input State
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);

    // 1. Handle Like
    const handleLike = async () => {
        // Optimistic UI Update
        if (isLiked) {
            setLikes(likes.filter(id => id !== authUser._id));
            setIsLiked(false);
        } else {
            setLikes([...likes, authUser._id]);
            setIsLiked(true);
        }

        try {
            const res = await fetch(`${baseUrl}/posts/like/${post._id}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setLikes(data);
        } catch (error) {
            toast.error(error.message);
        }
    };

    // 2. Handle Comment
    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        setIsCommenting(true);

        try {
            const res = await fetch(`${baseUrl}/posts/comment/${post._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ text: commentText }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setComments(data);
            setCommentText('');
            toast.success('Comment added');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsCommenting(false);
        }
    };

    // 3. Handle Delete
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            const res = await fetch(`${baseUrl}/posts/${post._id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success("Post deleted");
            if (onDelete) onDelete(post._id);

        } catch (error) {
            toast.error(error.message);
        }
    };

    const isMyPost = authUser?._id === post.user._id;

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${post.user._id}`} className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        {post.user.profilePicture ?
                            <img src={post.user.profilePicture} alt="pic" className="w-full h-full object-cover" /> :
                            <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                                {post.user.username[0].toUpperCase()}
                            </div>
                        }
                    </Link>
                    <div>
                        <Link to={`/profile/${post.user._id}`} className="font-bold text-gray-900 hover:underline">
                            {post.user.username}
                        </Link>
                        <div className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {isMyPost && (
                    <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            {/* Content */}
            <p className="text-gray-800 mb-3 whitespace-pre-wrap">{post.text}</p>
            {post.img && (
                <div className="rounded-xl overflow-hidden border border-gray-100 mb-3">
                    <img src={post.img} alt="Post content" className="w-full object-cover max-h-[500px]" />
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-6 pt-3 border-t border-gray-50">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-pink-600' : 'text-gray-500 hover:text-pink-500'}`}
                >
                    <Heart size={22} fill={isLiked ? "currentColor" : "none"} />
                    <span className="text-sm font-medium">{likes.length}</span>
                </button>

                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors"
                >
                    <MessageCircle size={22} />
                    <span className="text-sm font-medium">{comments.length}</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-4 pt-4 border-t border-gray-50 animate-fade-in">
                    {/* Input */}
                    <form onSubmit={handleComment} className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                        />
                        <button
                            type="submit"
                            disabled={isCommenting}
                            className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-colors disabled:opacity-50"
                        >
                            <Send size={18} />
                        </button>
                    </form>

                    {/* List */}
                    <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                        {comments.length === 0 ? (
                            <p className="text-center text-sm text-gray-400">No comments yet.</p>
                        ) : (
                            comments.map((comment, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                    {/* Commenter Avatar */}
                                    <Link to={`/profile/${comment.user?._id}`} className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                        {comment.user?.profilePicture ? (
                                            <img src={comment.user.profilePicture} alt="pic" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold text-xs">
                                                {comment.user?.username?.[0]?.toUpperCase()}
                                            </div>
                                        )}
                                    </Link>

                                    {/* Comment Text & Name */}
                                    <div className="bg-gray-100 rounded-2xl p-2 px-3">
                                        <Link to={`/profile/${comment.user?._id}`} className="font-bold text-xs text-gray-900 block hover:underline">
                                            {comment.user?.username}
                                        </Link>
                                        <span className="text-sm text-gray-800">{comment.text}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Post;