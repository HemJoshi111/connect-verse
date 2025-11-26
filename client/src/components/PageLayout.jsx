import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import RightPanel from './RightPanel';

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

            {/* Right Side */}
            <RightPanel />

            {/* { for mobile user show bottom navigation instead of side bar} */}
            <BottomNav />

        </div>
    );
};

export default PageLayout;