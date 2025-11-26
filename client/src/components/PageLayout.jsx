import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

// This component wraps the content of any page
const PageLayout = ({ children }) => {
    return (
        <div className="flex w-full min-h-screen bg-gray-50">

            {/* Left Side: Sidebar */}
            <Sidebar />

            {/* Center: The Main Content (Feed, Profile, etc.) */}
            <main className="flex-1 w-full max-w-2xl mx-auto p-4">
                {children}
            </main>

            {/* Right Side: Suggestions (Placeholder for now) */}
            <div className="hidden lg:block w-80 p-4 border-l border-gray-200">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-500 mb-4">Suggested for you</h3>
                    <p className="text-sm text-gray-400">User suggestions coming soon...</p>
                </div>
            </div>

            <BottomNav />

        </div>
    );
};

export default PageLayout;