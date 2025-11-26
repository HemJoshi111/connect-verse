import { useState } from 'react';
import { baseUrl } from '../utils/url';
import { useAuthContext } from '../context/AuthContext';
import PageLayout from '../components/PageLayout';
import toast, { Toaster } from 'react-hot-toast';

const SettingsPage = () => {
    const { authUser, setAuthUser } = useAuthContext();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        username: authUser?.username || '',
        email: authUser?.email || '',
        currentPassword: '',
        newPassword: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${baseUrl}/users/account`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success('Settings updated successfully!');

            // Update Global State & Local Storage
            setAuthUser(data.data);
            localStorage.setItem('user', JSON.stringify(data.data));

            // Clear password fields for security
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout>
            <Toaster />
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Account Settings</h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Section 1: Basic Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Security */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 pt-4 border-t">Change Password</h3>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    placeholder="Required to change password"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Leave blank to keep current"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                </form>
            </div>
        </PageLayout>
    );
};

export default SettingsPage;