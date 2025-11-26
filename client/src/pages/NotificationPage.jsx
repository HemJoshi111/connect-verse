import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import toast, { Toaster } from 'react-hot-toast';
import { Heart, UserPlus, MessageCircle, Trash2 } from 'lucide-react';

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/notifications', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                setNotifications(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    // Delete All Notifications
    const handleDeleteAll = async () => {
        if (!window.confirm("Clear all notifications?")) return;
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/notifications', {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications([]);
            toast.success("Notifications cleared");
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    return (
        <PageLayout>
            <Toaster />
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold">Notifications</h2>
                    {notifications.length > 0 && (
                        <button onClick={handleDeleteAll} className="text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>

                <div className="divide-y divide-gray-100">
                    {loading ? (
                        <div className="p-4 text-center">Loading...</div>
                    ) : notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No notifications yet 💤</div>
                    ) : (
                        notifications.map((notif) => (
                            <div key={notif._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
                                {/* Icon based on type */}
                                <div className="flex-shrink-0">
                                    {notif.type === 'follow' && <UserPlus className="text-indigo-500" size={24} />}
                                    {notif.type === 'like' && <Heart className="text-pink-500" size={24} />}
                                    {notif.type === 'comment' && <MessageCircle className="text-blue-500" size={24} />}
                                </div>

                                {/* Content */}
                                <Link to={`/profile/${notif.from._id}`} className="flex items-center gap-2 flex-1">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                        {notif.from.profilePicture ? (
                                            <img src={notif.from.profilePicture} alt="pic" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                                                {notif.from.username[0].toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-900 mr-1">{notif.from.username}</span>
                                        <span className="text-gray-600">
                                            {notif.type === 'follow' && "started following you"}
                                            {notif.type === 'like' && "liked your post"}
                                            {notif.type === 'comment' && "commented on your post"}
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default NotificationPage;