import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { setAuthUser } = useAuthContext();

    const navigate = useNavigate(); // Hook to redirect user after login

    // Update state when user types
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page refresh

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                // If status is not 200-299, throw error to catch block
                throw new Error(data.message || 'Something went wrong');
            }

            // Success!
            toast.success('Login Successful!');

            // Save token to localStorage (Browser Memory)
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.data));

            setAuthUser(data.data);

        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="auth-container">
            <Toaster /> {/* This shows the popup notifications */}
            <div className="auth-card">
                <h2>Welcome Back</h2>
                <p>Login to continue to ConnectVerse</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary">
                        Login
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;