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
            <div className="hidden lg:block w-80 p-4 bg-gray-50">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded-full"></div>
                    <div className="h-10 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        );
    }

    return (

        <div className="hidden lg:flex flex-col w-80 p-4 bg-gray-50 h-screen sticky top-0 overflow-y-auto custom-scrollbar border-l border-gray-200/50">

            {/* Section 1: Following */}
            <div className="mb-8">
                <h3 className="font-bold text-gray-500 mb-4 text-sm uppercase tracking-wider">Following ({connections.following.length})</h3>
                <div className="space-y-2">
                    {connections.following.length === 0 ? (
                        <p className="text-xs text-gray-400">You are not following anyone.</p>
                    ) : (
                        connections.following.map((user) => (
                            <Link
                                to={`/profile/${user._id}`}
                                key={user._id}
                                className="flex items-center gap-3 p-2 rounded-lg transition-all hover:bg-white hover:shadow-sm group"
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-200">
                                    {user.profilePicture ? (
                                        <img src={user.profilePicture} alt="pic" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-500 font-bold text-xs">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-semibold text-sm text-gray-700 truncate">{user.username}</p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Section 2: Followers */}
            <div>
                <h3 className="font-bold text-gray-500 mb-4 text-sm uppercase tracking-wider">Followers ({connections.followers.length})</h3>
                <div className="space-y-2">
                    {connections.followers.length === 0 ? (
                        <p className="text-xs text-gray-400">No followers yet.</p>
                    ) : (
                        connections.followers.map((user) => (
                            <Link
                                to={`/profile/${user._id}`}
                                key={user._id}
                                className="flex items-center gap-3 p-2 rounded-lg transition-all hover:bg-white hover:shadow-sm group"
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-200">
                                    {user.profilePicture ? (
                                        <img src={user.profilePicture} alt="pic" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-500 font-bold text-xs">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-gray-700 truncate">{user.username}</p>
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