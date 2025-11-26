import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { useAuthContext } from './context/AuthContext';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import NotificationPage from './pages/NotificationPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {

  const { authUser } = useAuthContext();
  return (
    <div>
      <Routes>
        {/* If user exists, go to Home. If not, go to Login */}
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />

        {/* If user exists, they shouldn't see Login. Redirect to Home */}
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />

        {/* If user exists, they shouldn't see Signup. Redirect to Home */}
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />

        <Route
          path="/profile/:id"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />

        <Route path="/search" element={authUser ? <SearchPage /> : <Navigate to="/login" />} />

        <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />

        <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />

        {/* 2. Add the Catch-All Route */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </div>
  );
}

export default App;