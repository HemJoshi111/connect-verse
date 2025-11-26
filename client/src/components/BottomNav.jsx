import { Link } from 'react-router-dom';
import { Home, Search, PlusSquare, User, LogOut } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';

const BottomNav = () => {
    const { authUser, setAuthUser } = useAuthContext();

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setAuthUser(null);
    };

    return (
        // Fixed at bottom, full width, hidden on desktop (md:hidden)
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 flex justify-around items-center md:hidden z-50 pb-safe">

            <Link to="/" className="p-2 text-gray-700 hover:text-indigo-600 transition-colors">
                <Home size={28} />
            </Link>

            <Link to="/search" className="p-2 text-gray-700 hover:text-indigo-600 transition-colors">
                <Search size={28} />
            </Link>

            {/* Create Post Button - could open a modal later, for now links to Home (where form is) */}
            <Link to="/" className="p-2 text-gray-700 hover:text-indigo-600 transition-colors">
                <PlusSquare size={28} />
            </Link>

            <Link to={`/profile/${authUser?._id}`} className="p-2 text-gray-700 hover:text-indigo-600 transition-colors">
                <User size={28} />
            </Link>

            <button onClick={logout} className="p-2 text-red-500 hover:text-red-600 transition-colors">
                <LogOut size={28} />
            </button>

        </div>
    );
};

export default BottomNav;