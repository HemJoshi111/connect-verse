import { useState } from 'react';
import { X, Image } from 'lucide-react';
import toast from 'react-hot-toast';

const CreatePostModal = ({ isOpen, onClose }) => {
    const [text, setText] = useState('');
    const [img, setImg] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImg(file);
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!text && !img) return;
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('text', text);
            if (img) formData.append('img', img);

            const token = localStorage.getItem('token');
            const res = await fetch('/api/posts/create', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success('Post created!');
            setText('');
            setImg(null);
            setPreviewImg(null);
            onClose();

            // Simple way to refresh feed if user is on Home Page
            if (window.location.pathname === '/') {
                window.location.reload();
            }

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl animate-fade-in">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Create Post</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handlePostSubmit} className="p-4">
                    <textarea
                        placeholder="What is happening?!"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full p-2 text-lg focus:outline-none resize-none mb-4"
                        rows="4"
                    />

                    {previewImg && (
                        <div className="relative mb-4">
                            <img src={previewImg} alt="Preview" className="w-full max-h-64 object-cover rounded-lg" />
                            <button
                                type="button"
                                onClick={() => { setImg(null); setPreviewImg(null); }}
                                className="absolute top-2 right-2 bg-gray-800 bg-opacity-75 text-white rounded-full p-1"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <div className="relative cursor-pointer text-indigo-500 hover:text-indigo-600">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Image size={24} />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || (!text && !img)}
                            className="bg-indigo-600 text-white px-5 py-2 rounded-full font-bold hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;