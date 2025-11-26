import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import toast from 'react-hot-toast';

const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // 1. Live Search Effect (Debounced)
    useEffect(() => {
        // Only search if query is not empty
        if (!query.trim()) {
            setResults([]);
            return;
        }

        // Set a timer to wait 500ms after the user stops typing
        const delayDebounceFn = setTimeout(async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`/api/users/search/${query}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();

                if (!res.ok) throw new Error(data.message);

                setResults(data);
            } catch (error) {
                // Silent error for search usually better UX than toast spam
                console.error(error);
            } finally {
                setLoading(false);
            }
        }, 500); // 500ms Delay

        // Cleanup: If user types again before 500ms, cancel the previous timer
        return () => clearTimeout(delayDebounceFn);
    }, [query]); // Run this every time 'query' changes

    // Prevent default form submit (Enter key)
    const handleSearch = (e) => {
        e.preventDefault();
    };

    return (
        <PageLayout>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold mb-6">Search Users</h2>

                {/* Search Input */}
                <form onSubmit={handleSearch} className="relative mb-8">
                    <input
                        type="text"
                        placeholder="Search by username..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus // Automatically focus input on load
                        className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                    <Search className="absolute left-4 top-4 text-gray-400" size={24} />

                    {/* Loading Spinner (Absolute Positioned) */}
                    {loading && (
                        <div className="absolute right-4 top-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                        </div>
                    )}
                </form>

                {/* Results List */}
                <div className="space-y-4">
                    {results.length > 0 ? (
                        results.map((user) => (
                            <Link
                                to={`/profile/${user._id}`}
                                key={user._id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors border border-gray-100"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                                        {user.profilePicture ? (
                                            <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold text-xl">
                                                {user.username[0].toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{user.username}</h3>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <span className="text-indigo-600 font-medium text-sm">View Profile</span>
                            </Link>
                        ))
                    ) : (
                        query && !loading && (
                            <p className="text-center text-gray-500 mt-10">No users found matching "{query}"</p>
                        )
                    )}

                    {!query && (
                        <div className="text-center text-gray-400 mt-10">
                            <Search className="mx-auto mb-2 opacity-50" size={48} />
                            <p>Type to search for people</p>
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default SearchPage;