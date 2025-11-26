import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To get ID from URL
import { useAuthContext } from '../context/AuthContext';
import PageLayout from '../components/PageLayout';
import toast, { Toaster } from 'react-hot-toast';
import { Camera, MapPin, Calendar, Edit3 } from 'lucide-react';

const ProfilePage = () => {
    const { id } = useParams(); // Get user ID from the URL (e.g. /profile/123)
    const { authUser, setAuthUser } = useAuthContext();

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Edit Mode States ---
    const [isEditing, setIsEditing] = useState(false);
    const [editBio, setEditBio] = useState('');
    const [editImg, setEditImg] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);
    const [updating, setUpdating] = useState(false);

    // 1. Fetch Profile & Posts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                // Fetch User Info
                const userRes = await fetch(`/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const userData = await userRes.json();
                if (!userRes.ok) throw new Error(userData.message);

                setProfile(userData.data);
                setEditBio(userData.data.bio || ''); // Initialize edit bio

                // Fetch User's Posts
                const postsRes = await fetch(`/api/posts/user/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const postsData = await postsRes.json();
                setPosts(postsData);

            } catch (error) {
                console.error(error);
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // 2. Handle Image Selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditImg(file);
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    // 3. Handle Update Submit
    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const formData = new FormData();
            formData.append('bio', editBio);
            if (editImg) formData.append('profilePicture', editImg);

            const token = localStorage.getItem('token');
            const res = await fetch('/api/users/update', {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success('Profile updated!');

            // Update local state
            setProfile(data.data);
            setIsEditing(false);

            // IMPORTANT: If we updated OUR OWN profile, update the Global Context too
            if (authUser._id === data.data._id) {
                setAuthUser(data.data);
                localStorage.setItem('user', JSON.stringify(data.data));
            }

        } catch (error) {
            toast.error(error.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <PageLayout><div className="text-center mt-10">Loading...</div></PageLayout>;
    if (!profile) return <PageLayout><div className="text-center mt-10">User not found</div></PageLayout>;

    // Check if this is MY profile
    const isMyProfile = authUser?._id === profile._id;

    return (
        <PageLayout>
            <Toaster />

            {/* --- Profile Header --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">

                {/* Banner (Simple Color for now) */}
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

                <div className="px-6 pb-6">
                    <div className="flex justify-between items-end -mt-12 mb-4">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                                {profile.profilePicture ? (
                                    <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-3xl font-bold text-gray-600">
                                        {profile.username[0].toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Edit Button (Only visible if it's My Profile) */}
                        {isMyProfile && (
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-colors flex items-center gap-2"
                            >
                                <Edit3 size={16} />
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        )}
                    </div>

                    {/* User Info */}
                    <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                        <span>@{profile.email.split('@')[0]}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Calendar size={14} /> Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                    </div>

                    <p className="mt-4 text-gray-700 whitespace-pre-wrap">
                        {profile.bio || "No bio yet."}
                    </p>

                    {/* Stats */}
                    <div className="flex gap-6 mt-6 border-t border-gray-100 pt-4">
                        <div><span className="font-bold text-gray-900">{posts.length}</span> <span className="text-gray-500">Posts</span></div>
                        <div><span className="font-bold text-gray-900">{profile.followers?.length || 0}</span> <span className="text-gray-500">Followers</span></div>
                        <div><span className="font-bold text-gray-900">{profile.following?.length || 0}</span> <span className="text-gray-500">Following</span></div>
                    </div>
                </div>
            </div>

            {/* --- Edit Form (Visible only when Editing) --- */}
            {isEditing && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 animate-fade-in">
                    <h3 className="font-bold text-lg mb-4">Edit Profile</h3>
                    <form onSubmit={handleUpdate}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                            <div className="flex items-center gap-4">
                                {previewImg && <img src={previewImg} className="w-12 h-12 rounded-full object-cover" alt="Preview" />}
                                <input type="file" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                            <textarea
                                value={editBio}
                                onChange={(e) => setEditBio(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                rows="3"
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="submit"
                                disabled={updating}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
                            >
                                {updating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* --- User Posts Grid --- */}
            <h3 className="font-bold text-xl mb-4 text-gray-800">Posts</h3>
            <div className="grid grid-cols-1 gap-6">
                {posts.length === 0 ? (
                    <p className="text-gray-500 text-center py-10 bg-white rounded-xl">Has not posted anything yet.</p>
                ) : (
                    posts.map((post) => (
                        <div key={post._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <p className="mb-3 text-gray-800">{post.text}</p>
                            {post.img && (
                                <img src={post.img} alt="Post" className="w-full h-auto rounded-lg object-cover" />
                            )}
                            <p className="text-xs text-gray-400 mt-2">{new Date(post.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))
                )}
            </div>

        </PageLayout>
    );
};

export default ProfilePage;