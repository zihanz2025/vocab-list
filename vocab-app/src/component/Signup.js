import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Paper, TextInput, PasswordInput, Button, Text, Title, Stack, Container } from '@mantine/core';
import { supabase } from '../supaBaseClient.js';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // --- Front-end password validation ---
    if (password.length < 8) {
      setMessage('Password must be at least 8 characters.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setMessage('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setMessage('Password must contain at least one number.');
      return;
    }

    setLoading(true);

    // --- Sign up with Supabase ---
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname,
          display_name: nickname, // <-- store nickname in display_name
         }, // stored in user_metadata
        emailRedirectTo: `${window.location.origin}/login`, // redirect after email confirmation
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Signup successful! Check your email to confirm your account.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(180deg, #fffdfdff 0%, #bab8b8ff 100%)',
      }}
    >
      <Container size={600} px="md">
        <Paper withBorder shadow="sm" p="xl" style={{ width: 340, textAlign: 'center', backgroundColor: 'white' }}>
          <Title order={2} mb="md">Sign Up</Title>

          <form onSubmit={handleSignup}>
            <Stack spacing="sm">
              <TextInput
                placeholder="Set a display name for yourself"
                value={nickname}
                onChange={(e) => setNickname(e.currentTarget.value)}
                required
              />
              <TextInput
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                required
              />
              <PasswordInput
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
              />
              <Button type="submit" size="md" loading={loading}>Sign Up</Button>
            </Stack>
          </form>

          {message && (
            <Text size="sm" color={message.includes('success') ? 'green' : 'red'} mt="md">
              {message}
            </Text>
          )}

          <Text size="sm" mt="md">
            Already have an account? <Link to="/login">Log in</Link>
          </Text>
        </Paper>
      </Container>
    </div>
  );
}
