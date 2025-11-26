import { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import PageLayout from '../components/PageLayout';
import { Heart } from 'lucide-react';

const HomePage = () => {
    const { authUser, setAuthUser } = useAuthContext();
    const [posts, setPosts] = useState([]);

    // --- New States for Create Post ---
    const [text, setText] = useState('');
    const [img, setImg] = useState(null);
    const [previewImg, setPreviewImg] = useState(null); // To show the image before uploading
    const [loading, setLoading] = useState(false);

    // Logout Function
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setAuthUser(null);
    };

    // Fetch Posts
    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/posts/all', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setPosts(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // --- New: Handle Image Selection ---
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImg(file);
            // Create a fake URL just to show preview
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    // --- New: Handle Post Submission ---
    const handlePostSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Prepare FormData (Required for files)
            const formData = new FormData();
            formData.append('text', text);
            if (img) {
                formData.append('img', img); // 'img' must match backend field name
            }

            // 2. Send Request
            const token = localStorage.getItem('token');
            const res = await fetch('/api/posts/create', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Note: DO NOT set 'Content-Type': 'application/json' for FormData!
                    // The browser sets the correct 'multipart/form-data' boundary automatically.
                },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success('Post created!');

            // 3. Reset Form
            setText('');
            setImg(null);
            setPreviewImg(null);

            // 4. Refresh Feed (Fetch posts again so new one appears)
            fetchPosts();

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout>
            <Toaster />

            {/* Create Post Section - Now styled with Tailwind */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                <form onSubmit={handlePostSubmit}>
                    <textarea
                        placeholder="What is happening?!"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full p-2 border-b border-gray-100 focus:outline-none resize-none text-lg mb-3"
                        rows="2"
                    />

                    {previewImg && (
                        <div className="relative mb-4">
                            <img src={previewImg} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                            <button
                                type="button"
                                onClick={() => { setImg(null); setPreviewImg(null); }}
                                className="absolute top-2 right-2 bg-gray-800 bg-opacity-75 text-white rounded-full p-1 hover:bg-black"
                            >
                                X
                            </button>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <button type="button" className="text-indigo-500 hover:text-indigo-600 font-medium text-sm">
                                + Add Photo
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-5 py-2 rounded-full font-bold text-white transition-all ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Feed Section */}
            <div className="space-y-4">
                {posts.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        <p>Welcome to ConnectVerse! 👋</p>
                        <p className="text-sm">Start following people to see posts.</p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <div key={post._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center gap-3 mb-3">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                    {post.user.profilePicture ?
                                        <img src={post.user.profilePicture} alt="pic" className="w-full h-full object-cover" /> :
                                        <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                                            {post.user.username[0].toUpperCase()}
                                        </div>
                                    }
                                </div>
                                {/* User Info */}
                                <div>
                                    <span className="font-bold text-gray-900">{post.user.username}</span>
                                    <span className="text-sm text-gray-500 ml-2">
                                        • {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-800 mb-3 whitespace-pre-wrap">{post.text}</p>

                            {post.img && (
                                <div className="rounded-xl overflow-hidden border border-gray-100">
                                    <img src={post.img} alt="Post content" className="w-full object-cover" />
                                </div>
                            )}

                            {/* Like/Comment Buttons (Placeholder UI for now) */}
                            <div className="flex items-center gap-6 mt-4 pt-3 border-t border-gray-50 text-gray-500">
                                <button className="flex items-center gap-2 hover:text-pink-500 transition-colors">
                                    <Heart size={20} />
                                </button>
                                <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                                    <span className="text-sm">Comment</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </PageLayout>
    );
};

export default HomePage;