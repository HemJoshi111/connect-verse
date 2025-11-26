import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import PageLayout from '../components/PageLayout';
import toast, { Toaster } from 'react-hot-toast';
import { Calendar, Edit3, UserPlus, UserCheck } from 'lucide-react';
import Post from '../components/Post';
import { baseUrl } from '../utils/url';

const ProfilePage = () => {
    const { id } = useParams();
    const { authUser, setAuthUser } = useAuthContext();

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isFollowing, setIsFollowing] = useState(false);
    const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editBio, setEditBio] = useState('');
    const [editFullName, setEditFullName] = useState('');
    const [editImg, setEditImg] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                // 2. Use baseUrl
                const userRes = await fetch(`${baseUrl}/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const userData = await userRes.json();
                if (!userRes.ok) throw new Error(userData.message);

                setProfile(userData.data);
                setEditBio(userData.data.bio || '');
                setEditFullName(userData.data.fullName || ''); // Initialize name

                const amIFollowing = userData.data.followers.includes(authUser._id);
                setIsFollowing(amIFollowing);

                // 2. Use baseUrl
                const postsRes = await fetch(`${baseUrl}/posts/user/${id}`, {
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
    }, [id, authUser._id]);

    const handleFollow = async () => {
        if (isUpdatingFollow) return;
        setIsUpdatingFollow(true);

        try {
            const token = localStorage.getItem('token');
            // 2. Use baseUrl
            const res = await fetch(`${baseUrl}/users/follow/${id}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            if (isFollowing) {
                toast.success("Unfollowed");
                setIsFollowing(false);
                setProfile(prev => ({
                    ...prev,
                    followers: prev.followers.filter(uid => uid !== authUser._id)
                }));
                const updatedAuthUser = {
                    ...authUser,
                    following: (authUser.following || []).filter(uid => uid !== id)
                };
                setAuthUser(updatedAuthUser);
                localStorage.setItem('user', JSON.stringify(updatedAuthUser));

            } else {
                toast.success("Followed!");
                setIsFollowing(true);
                setProfile(prev => ({
                    ...prev,
                    followers: [...prev.followers, authUser._id]
                }));
                const updatedAuthUser = {
                    ...authUser,
                    following: [...(authUser.following || []), id]
                };
                setAuthUser(updatedAuthUser);
                localStorage.setItem('user', JSON.stringify(updatedAuthUser));
            }

        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsUpdatingFollow(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditImg(file);
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const formData = new FormData();
            formData.append('bio', editBio);
            formData.append('fullName', editFullName); // <--- Send Full Name
            if (editImg) formData.append('profilePicture', editImg);

            const token = localStorage.getItem('token');
            // 2. Use baseUrl
            const res = await fetch(`${baseUrl}/users/update`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success('Profile updated!');
            setProfile(data.data);
            setIsEditing(false);

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

    if (loading) return <PageLayout><div className="flex justify-center mt-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div></PageLayout>;
    if (!profile) return <PageLayout><div className="text-center mt-10">User not found</div></PageLayout>;

    const isMyProfile = authUser?._id === profile._id;

    return (
        <PageLayout>
            <Toaster />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

                <div className="px-6 pb-6">
                    <div className="flex justify-between items-end -mt-12 mb-4">
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

                        {isMyProfile ? (
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-colors flex items-center gap-2"
                            >
                                <Edit3 size={16} />
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        ) : (
                            <button
                                onClick={handleFollow}
                                disabled={isUpdatingFollow}
                                className={`px-6 py-2 rounded-full font-bold text-white transition-all flex items-center gap-2
                            ${isFollowing
                                        ? 'bg-gray-800 hover:bg-gray-900'
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                    }`}
                            >
                                {isFollowing ? <UserCheck size={18} /> : <UserPlus size={18} />}
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                        )}
                    </div>

                    {/* 3. Display Full Name and Username */}
                    <h1 className="text-2xl font-bold text-gray-900">{profile.fullName || profile.username}</h1>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                        <span>@{profile.username}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Calendar size={14} /> Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                    </div>

                    <p className="mt-4 text-gray-700 whitespace-pre-wrap">
                        {profile.bio || "No bio yet."}
                    </p>

                    <div className="flex gap-6 mt-6 border-t border-gray-100 pt-4">
                        <div><span className="font-bold text-gray-900">{posts.length}</span> <span className="text-gray-500">Posts</span></div>
                        <div><span className="font-bold text-gray-900">{profile.followers?.length || 0}</span> <span className="text-gray-500">Followers</span></div>
                        <div><span className="font-bold text-gray-900">{profile.following?.length || 0}</span> <span className="text-gray-500">Following</span></div>
                    </div>
                </div>
            </div>

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
                        {/* 3. Full Name Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={editFullName}
                                onChange={(e) => setEditFullName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="John Doe"
                            />
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

            <h3 className="font-bold text-xl mb-4 text-gray-800">Posts</h3>
            <div className="space-y-4">
                {posts.length === 0 ? (
                    <p className="text-gray-500 text-center py-10 bg-white rounded-xl border border-gray-200">Has not posted anything yet.</p>
                ) : (
                    posts.map((post) => (
                        <Post key={post._id} post={post} />
                    ))
                )}
            </div>

        </PageLayout>
    );
};

export default ProfilePage;