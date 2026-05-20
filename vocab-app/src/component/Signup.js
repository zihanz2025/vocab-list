import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Paper, TextInput, PasswordInput, Button, Text, Title, Stack, Box, Anchor } from '@mantine/core';
import { supabase } from '../supabaseClient.js';
import { IconUser, IconMail, IconLock, IconArrowRight, IconUserPlus } from '@tabler/icons-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname, display_name: nickname },
        emailRedirectTo: `${window.location.origin}/login`,
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
          width: '100%',
          maxWidth: 420, 
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
            <IconUserPlus size={32} color="white" />
          </div>
        </Box>

        <Title order={2} mb="sm" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2937' }}>
          Create Account
        </Title>
        <Text size="sm" c="neutral.5" mb="xl">
          Start your French learning journey
        </Text>

        <form onSubmit={handleSignup}>
          <Stack spacing="md">
            <div>
              <Text size="sm" c="neutral.6" mb="xs" style={{ textAlign: 'left', fontWeight: 500 }}>
                Display Name
              </Text>
              <TextInput 
                placeholder="Enter your nickname" 
                value={nickname} 
                onChange={(e) => setNickname(e.currentTarget.value)} 
                required
                onFocus={() => setFocusedField('nickname')}
                onBlur={() => setFocusedField('')}
                leftSection={<IconUser size={18} style={{ color: focusedField === 'nickname' ? '#800020' : '#9ca3af' }} />}
                style={{ 
                  borderRadius: '12px',
                  borderColor: focusedField === 'nickname' ? '#800020' : '#e5e7eb',
                  boxShadow: focusedField === 'nickname' ? '0 0 0 3px rgba(128, 0, 32, 0.1)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              />
            </div>

            <div>
              <Text size="sm" c="neutral.6" mb="xs" style={{ textAlign: 'left', fontWeight: 500 }}>
                Email
              </Text>
              <TextInput 
                placeholder="your@email.com" 
                value={email} 
                onChange={(e) => setEmail(e.currentTarget.value)} 
                required
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                leftSection={<IconMail size={18} style={{ color: focusedField === 'email' ? '#800020' : '#9ca3af' }} />}
                style={{ 
                  borderRadius: '12px',
                  borderColor: focusedField === 'email' ? '#800020' : '#e5e7eb',
                  boxShadow: focusedField === 'email' ? '0 0 0 3px rgba(128, 0, 32, 0.1)' : 'none',
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
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                leftSection={<IconLock size={18} style={{ color: focusedField === 'password' ? '#800020' : '#9ca3af' }} />}
                style={{ 
                  borderRadius: '12px',
                  borderColor: focusedField === 'password' ? '#800020' : '#e5e7eb',
                  boxShadow: focusedField === 'password' ? '0 0 0 3px rgba(128, 0, 32, 0.1)' : 'none',
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
              {loading ? 'Creating...' : (
                <>
                  Create Account
                  <IconArrowRight size={16} style={{ marginLeft: '8px', color: '#ffffff', display: 'inline-block' }} />
                </>
              )}
            </button>
          </Stack>
        </form>

        {message && (
          <Text size="sm" mt="md" c={message.includes('successful') ? 'green' : 'red'} style={{ fontWeight: 500 }}>
            {message}
          </Text>
        )}

        <Text size="sm" mt="md" c="neutral.5">
          Already have an account?{' '}
          <Anchor component={Link} to="/login" style={{ color: '#667eea', fontWeight: 500 }}>
            Log in
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}