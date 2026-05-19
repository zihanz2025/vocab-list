import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Paper, TextInput, PasswordInput, Button, Text, Title, Stack, Box, Anchor } from '@mantine/core';
import { supabase } from '../supabaseClient';
import { IconMail, IconLock, IconArrowRight, IconUser } from '@tabler/icons-react';

export default function Login({}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
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
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #FFF8F0 0%, #F5E6D3 100%)',
      padding: '1rem'
    }}>
      <Paper 
        shadow="xl" 
        radius="xl" 
        p="xl" 
        style={{ 
          width: 420, 
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        <Box mb="lg">
          <div 
            style={{
              width: '70px',
              height: '70px',
              margin: '0 auto',
              background: '#800020',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 40px rgba(128, 0, 32, 0.4)',
            }}
          >
            <IconUser size={32} color="white" />
          </div>
        </Box>

        <Title order={2} mb="sm" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2937' }}>
          Welcome Back
        </Title>
        <Text size="sm" c="neutral.5" mb="xl">
          Sign in to continue learning French
        </Text>

        <form onSubmit={handleLogin}>
          <Stack spacing="md">
            <div>
              <Text size="sm" c="neutral.6" mb="xs" style={{ textAlign: 'left', fontWeight: 500 }}>
                Email
              </Text>
              <TextInput 
                placeholder="your@email.com" 
                value={email} 
                onChange={(e) => setEmail(e.currentTarget.value)} 
                required
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                leftSection={<IconMail size={18} style={{ color: emailFocused ? '#800020' : '#9ca3af' }} />}
                style={{ 
                  borderRadius: '12px',
                  borderColor: emailFocused ? '#800020' : '#e5e7eb',
                  boxShadow: emailFocused ? '0 0 0 3px rgba(128, 0, 32, 0.1)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              />
            </div>

            <div>
              <Text size="sm" c="neutral.6" mb="xs" style={{ textAlign: 'left', fontWeight: 500 }}>
                Password
              </Text>
              <PasswordInput 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.currentTarget.value)} 
                required
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                leftSection={<IconLock size={18} style={{ color: passwordFocused ? '#800020' : '#9ca3af' }} />}
                style={{ 
                  borderRadius: '12px',
                  borderColor: passwordFocused ? '#800020' : '#e5e7eb',
                  boxShadow: passwordFocused ? '0 0 0 3px rgba(128, 0, 32, 0.1)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                background: '#800020',
                color: '#ffffff',
                fontWeight: 600,
                borderRadius: '12px',
                boxShadow: '0 4px 14px 0 rgba(128, 0, 32, 0.4)',
                padding: '12px 24px',
                lineHeight: '1.6',
                fontSize: '14px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {loading ? 'Signing in...' : (
                <>
                  Sign In
                  <IconArrowRight size={16} style={{ marginLeft: '8px', color: '#ffffff', display: 'inline-block' }} />
                </>
              )}
            </button>
          </Stack>
        </form>

        {message && (
          <Text size="sm" mt="md" c="red" style={{ fontWeight: 500 }}>
            {message}
          </Text>
        )}

        <Text size="sm" mt="md" c="neutral.5">
          Don't have an account?{' '}
          <Anchor component={Link} to="/signup" style={{ color: '#667eea', fontWeight: 500 }}>
            Sign up
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}