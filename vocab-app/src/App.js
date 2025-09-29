import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import Signup from './components/Signup';
import Login from './components/Login';
import Listview from './components/Listview';
import { supabase } from './supaBaseClient';
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        {user ? (
          <Route path="/*" element={<Listview />} />
        ) : (
          <>
            <Route path="/" element={<Welcome />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login onLogin={setUser} />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
