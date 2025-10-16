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
      mode: [
        "#FFFFFF", // white
        "#E3E3E3",
        "#C7C7C7",
        "#ABABAB",
        "#8F8F8F",
        "#666565ff",
        "#575757",
        "#3B3B3B",
        "#1F1F1F",
        "#000000"  // black
      ],
    },
    primaryColor: 'mode',
    defaultRadius: 'xs',
  }}
  defaultColorScheme="light"
>
      <Router basename="/vocab-list">
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
