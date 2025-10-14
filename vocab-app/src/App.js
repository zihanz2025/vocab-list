import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { createTheme } from '@mantine/core';
import '@mantine/core/styles.css'; 
import { supabase } from './supaBaseClient';
import { useState, useEffect } from 'react';
import Welcome from './component/Welcome';
import Signup from './component/Signup';
import Login from './component/Login';
import Listview from './component/Listview';
import About from './component/About';

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
    <MantineProvider
  theme={{
    colors: {
      ocean: [
        '#e6fefc', // very light, almost white
        '#b3f4eb',
        '#81e9db',
        '#4fded0', // soft greenish-blue
        '#29d6c8',
        '#00cfc0', // base ocean green-blue
        '#00bfb0',
        '#00a999',
        '#009380',
        '#006f60', // darkest
      ],
    },
    primaryColor: 'ocean',
    defaultRadius: 'md',
  }}
  defaultColorScheme="light"
>
      <Router>
        <Routes>
          {/* Protect private route */}
          <Route
            path="/list"
            element={user ? <Listview /> : <Navigate to="/" replace />}
          />

          {/* Public routes */}
          <Route
            path="/"
            element={user ? <Navigate to="/list" replace /> : <Welcome />}
          />
          <Route
            path="about"
            element={<About />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/list" replace /> : <Signup />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/list" replace /> : <Login />}
          />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
