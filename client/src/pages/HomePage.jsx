import { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import PageLayout from '../components/PageLayout';
import Post from '../components/Post';
import PostSkeleton from '../components/skeletons/PostSkeleton'; // <--- Import Skeleton
import { Image } from 'lucide-react';

const HomePage = () => {
    const { authUser } = useAuthContext();
    const [posts, setPosts] = useState([]);

    // State for loading the Feed
    const [isFetching, setIsFetching] = useState(true);

    // State for creating a post
    const [text, setText] = useState('');
    const [img, setImg] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    // 1. Fetch Posts
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
            toast.error("Failed to load feed");
        } finally {
            setIsFetching(false); // Stop loading spinner
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // 2. Handle Image Selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImg(file);
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    // 3. Handle Post Submission
    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!text && !img) return;

        setIsCreating(true);

        try {
            const formData = new FormData();
            formData.append('text', text);
            if (img) {
                formData.append('img', img);
            }

            const token = localStorage.getItem('token');
            const res = await fetch('/api/posts/create', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success('Post created!');
            setText('');
            setImg(null);
            setPreviewImg(null);
            fetchPosts();

        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeletePost = (id) => {
        setPosts(posts.filter(p => p._id !== id));
    };

    return (
        <PageLayout>
            <Toaster />

            {/* --- Create Post Section --- */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                <form onSubmit={handlePostSubmit}>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                            {authUser?.profilePicture ? (
                                <img src={authUser.profilePicture} alt="pic" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                                    {authUser?.username?.[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <textarea
                                placeholder="What is happening?!"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full p-2 border-b border-gray-100 focus:outline-none resize-none text-lg mb-2"
                                rows="2"
                            />

                            {previewImg && (
                                <div className="relative mb-4">
                                    <img src={previewImg} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                                    <button
                                        type="button"
                                        onClick={() => { setImg(null); setPreviewImg(null); }}
                                        className="absolute top-2 right-2 bg-gray-800 bg-opacity-75 text-white rounded-full p-1 hover:bg-black transition-colors"
                                    >
                                        X
                                    </button>
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-2">
                                <div className="relative cursor-pointer group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex items-center gap-2 text-indigo-500 group-hover:text-indigo-600 font-medium text-sm transition-colors">
                                        <Image size={20} />
                                        <span>Add Photo</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isCreating || (!text && !img)}
                                    className={`px-5 py-2 rounded-full font-bold text-white transition-all 
                                ${isCreating || (!text && !img)
                                            ? 'bg-indigo-300 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
                                        }`}
                                >
                                    {isCreating ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* --- Feed Section  --- */}
            <div className="space-y-4">

                {/* Scenario 1: Loading -> Show Skeletons */}
                {isFetching && (
                    <>
                        <PostSkeleton />
                        <PostSkeleton />
                        <PostSkeleton />
                    </>
                )}

                {/* Scenario 2: Not Loading but Empty -> Show Welcome Message */}
                {!isFetching && posts.length === 0 && (
                    <div className="text-center py-10 bg-white rounded-xl border border-gray-100">
                        <p className="text-xl font-bold text-gray-800 mb-2">Welcome to ConnectVerse! 👋</p>
                        <p className="text-gray-500">Your feed is empty. Start posting or follow users!</p>
                    </div>
                )}

                {/* Scenario 3: Loaded and Has Data -> Show Posts */}
                {!isFetching && posts.map((post) => (
                    <Post
                        key={post._id}
                        post={post}
                        onDelete={handleDeletePost}
                    />
                ))}

            </div>
        </PageLayout>
    );
};

export default HomePage;