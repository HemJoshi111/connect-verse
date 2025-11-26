import { Link } from 'react-router-dom';
import { Home, Search, PlusSquare, Heart, User, LogOut, Settings } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { useState } from 'react'; // Import useState
import CreatePostModal from './CreatePostModal'; // Import Modal

const Sidebar = () => {
    const { authUser, setAuthUser } = useAuthContext();
    const [isModalOpen, setIsModalOpen] = useState(false); // State for Modal

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setAuthUser(null);
    };

    return (
        <div className="hidden md:flex flex-col w-64 h-screen border-r border-gray-200 sticky top-0 left-0 p-4 bg-white z-20">

            {/* 1. Logo */}
            <div className="mb-8">
                <Link to="/" className="cursor-pointer block w-fit">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                        ConnectVerse
                    </h1>
                </Link>
            </div>

            {/* 2. Navigation Menu */}
            <nav className="flex-1 space-y-2">
                <Link to="/" className="flex items-center gap-4 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200">
                    <Home size={24} />
                    <span className="font-medium text-lg">Home</span>
                </Link>

                <Link to="/search" className="flex items-center gap-4 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200">
                    <Search size={24} />
                    <span className="font-medium text-lg">Search</span>
                </Link>

                <Link to="/notifications" className="flex items-center gap-4 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200">
                    <Heart size={24} />
                    <span className="font-medium text-lg">Notifications</span>
                </Link>

                {/* Create Post Button (Now opens Modal) */}
                <div
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-4 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                >
                    <PlusSquare size={24} />
                    <span className="font-medium text-lg">Create</span>
                </div>

                {/* Settings Button */}
                <Link to="/settings" className="flex items-center gap-4 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200">
                    <Settings size={24} />
                    <span className="font-medium text-lg">Settings</span>
                </Link>

                <Link to={`/profile/${authUser?._id}`} className="flex items-center gap-4 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200">
                    {authUser?.profilePicture ? (
                        <img src={authUser.profilePicture} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                        <User size={24} />
                    )}
                    <span className="font-medium text-lg">Profile</span>
                </Link>
            </nav>

            {/* 3. Footer / Logout */}
            <div className="mt-auto border-t pt-4">
                <button
                    onClick={logout}
                    className="flex items-center gap-4 p-3 w-full rounded-lg text-red-500 hover:bg-red-50 transition-all duration-200"
                >
                    <LogOut size={24} />
                    <span className="font-medium text-lg">Logout</span>
                </button>
            </div>

            {/* RENDER MODAL HERE */}
            <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        </div>
    );
};

export default Sidebar;