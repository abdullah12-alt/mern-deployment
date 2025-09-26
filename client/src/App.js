// client/src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './components/Auth/Login';
import UserTable from './components/Admin/UserTable';
import LandingPage from './components/LandingPage';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/admin" />} />
        <Route
          path="/admin"
          element={user && user.role === 'admin' ? <UserTable /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;