import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const RightPanel = () => {
    const [connections, setConnections] = useState({ followers: [], following: [] });
    const [loading, setLoading] = useState(true);
    const { authUser } = useAuthContext();

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/users/connections', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                setConnections(data);
            } catch (error) {
                console.error("Failed to fetch connections", error);
            } finally {
                setLoading(false);
            }
        };

        if (authUser) fetchConnections();
    }, [authUser]);

    if (loading) {
        return (
            <div className="hidden lg:block w-80 p-4 border-l border-gray-200 bg-white">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded-full"></div>
                    <div className="h-10 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="hidden lg:flex flex-col w-80 p-4 border-l border-gray-200 bg-white h-screen sticky top-0 overflow-y-auto custom-scrollbar">

            {/* Section 1: Following */}
            <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Following ({connections.following.length})</h3>
                <div className="space-y-3">
                    {connections.following.length === 0 ? (
                        <p className="text-sm text-gray-500">You are not following anyone.</p>
                    ) : (
                        connections.following.map((user) => (
                            <Link
                                to={`/profile/${user._id}`}
                                key={user._id}
                                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100 group-hover:border-indigo-200">
                                    {user.profilePicture ? (
                                        <img src={user.profilePicture} alt="pic" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900">{user.username}</p>
                                    <p className="text-xs text-gray-400">View Profile</p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Section 2: Followers */}
            <div>
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Followers ({connections.followers.length})</h3>
                <div className="space-y-3">
                    {connections.followers.length === 0 ? (
                        <p className="text-sm text-gray-500">No followers yet.</p>
                    ) : (
                        connections.followers.map((user) => (
                            <Link
                                to={`/profile/${user._id}`}
                                key={user._id}
                                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100 group-hover:border-indigo-200">
                                    {user.profilePicture ? (
                                        <img src={user.profilePicture} alt="pic" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900">{user.username}</p>
                                    <p className="text-xs text-gray-400">View Profile</p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
};

export default RightPanel;