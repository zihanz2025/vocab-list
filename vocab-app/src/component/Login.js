import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Paper, TextInput, PasswordInput, Button, Text, Title, Stack } from '@mantine/core';
import { supabase } from '../supaBaseClient';

export default function Login({}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) setMessage(error.message);
    else {
      navigate('/list');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', 
    background: 'linear-gradient(180deg, #fffdfdff 0%, #bab8b8ff 100%)' }}>
      <Paper withBorder shadow="sm" p="xl" style={{ width: 400, textAlign: 'center', backgroundColor: 'white' }}>
        <Title order={2} mb="md">Login</Title>
        <form onSubmit={handleLogin}>
          <Stack>
            <TextInput label="" placeholder="Email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} required />
            <PasswordInput label="" placeholder="Password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} required />
            <Button type="submit" size="md">Log in</Button>
          </Stack>
        </form>
        {message && (
            <Text size="sm" mt="md" c="#8F8F8F">
              {message}
            </Text>
          )}
        <Text size="sm" mt="md">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </Text>
      </Paper>
    </div>
  );
}
