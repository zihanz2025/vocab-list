import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './../supaBaseClient';
import Welcome from './Welcome';
import Signup from './Signup';
import Login from './Login';
import Listview from './Listview';
import About from './About';

export default function AppContent() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session) {
        console.log("No session found, redirecting anyway.");
        return navigate('/', { replace: true });
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout failed:', error);
      return;
    }
    setUser(null);
    navigate('/', { replace: true });
  };

  return (
    <Routes>
      <Route path="/list" element={user ? <Listview onLogout={handleLogout} /> : <Navigate to="/" replace />} />
      <Route path="/" element={user ? <Navigate to="/list" replace /> : <Welcome />} />
      <Route path="/about" element={<About />} />
      <Route path="/signup" element={user ? <Navigate to="/list" replace /> : <Signup />} />
      <Route path="/login" element={user ? <Navigate to="/list" replace /> : <Login />} />
    </Routes>
  );
}
