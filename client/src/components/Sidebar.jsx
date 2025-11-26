import { Link } from 'react-router-dom';
import { Home, Search, PlusSquare, Heart, User, LogOut } from 'lucide-react'; // Professional Icons
import { useAuthContext } from '../context/AuthContext';

const Sidebar = () => {
    const { authUser, setAuthUser } = useAuthContext();

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setAuthUser(null);
    };

    return (
        // Container: Fixed height, sticky on left, hidden on small mobile screens
        <div className="hidden md:flex flex-col w-64 h-screen border-r border-gray-200 sticky top-0 left-0 p-4 bg-white">

            {/* 1. Logo */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    ConnectVerse
                </h1>
            </div>

            {/* 2. Navigation Menu */}
            <nav className="flex-1 space-y-2">

                {/* Home Link */}
                <Link to="/" className="flex items-center gap-4 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200">
                    <Home size={24} />
                    <span className="font-medium text-lg">Home</span>
                </Link>

                {/* Search (Coming Soon) */}
                <div className="flex items-center gap-4 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                    <Search size={24} />
                    <span className="font-medium text-lg">Search</span>
                </div>

                {/* Create Post (We will connect this later) */}
                <div className="flex items-center gap-4 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                    <PlusSquare size={24} />
                    <span className="font-medium text-lg">Create</span>
                </div>

                {/* Notifications (Coming Soon) */}
                <div className="flex items-center gap-4 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                    <Heart size={24} />
                    <span className="font-medium text-lg">Notifications</span>
                </div>

                {/* Profile Link */}
                <Link to={`/profile/${authUser?._id}`} className="flex items-center gap-4 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200">
                    {/* Show Avatar if exists, else Icon */}
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

        </div>
    );
};

export default Sidebar;