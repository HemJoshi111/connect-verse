import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 p-4">

            <div className="text-center space-y-6 max-w-md">
                {/* Icon & Error Code */}
                <div className="flex justify-center">
                    <div className="bg-indigo-50 p-6 rounded-full">
                        <AlertTriangle size={64} className="text-indigo-600" />
                    </div>
                </div>

                <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    404
                </h1>

                <h2 className="text-3xl font-bold">Page not found</h2>

                <p className="text-gray-500 text-lg">
                    Sorry, we couldn't find the page you're looking for. It might have been removed or the link is broken.
                </p>

                {/* Action Button */}
                <div className="pt-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30"
                    >
                        <Home size={20} />
                        Back to Home
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default NotFoundPage;