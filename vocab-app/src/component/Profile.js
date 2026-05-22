import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { TextInput, PasswordInput, Button, Group, Text, Stack, Container, Title, Paper, Menu } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { IconUser, IconLock, IconLogout, IconArrowLeft, IconUpload } from '@tabler/icons-react';

export default function Profile() {
  const [nickname, setNickname] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [messageName, setMessageName] = useState(''); 
  const [messagePassword, setMessagePassword] = useState(''); 
  const [nicknameFocused, setNicknameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser(){
      const { data: { user }, userError } = await supabase.auth.getUser();
      if (!user || userError) console.log('Error fetching user info:', userError);
      const userId = user.id;
      const { data, error } = await supabase
      .from('profiles')
      .select('nickname')
      .eq('id', userId)
      .single();

    if (error) console.log('Error fetching user info:', error);
    else{ 
        setNickname(data.nickname);}
    }
    fetchUser();
  }, []);

  const validateNewPassword = (password) => {
    if (password.length < 8) {
      setMessagePassword('Password must be at least 8 characters.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setMessagePassword('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setMessagePassword('Password must contain at least one number.');
      return;
    }
  };

  const handleUpdateNickname = async (e) => {
    e.preventDefault();
    setMessagePassword('');
    const { error } = await supabase.auth.updateUser({
      data: { display_name: nickname },
    });
    if (error) setMessageName(error.message);
    else setMessageName('Nickname updated!' );
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessageName('');
    if (!newPassword) {
      setMessagePassword('Fill in new password');
      return;
    }

    const validationError = validateNewPassword(newPassword);
    if (validationError) {
      setMessagePassword(validationError);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) setMessagePassword(updateError.message);
    else {
      setMessagePassword( 'Password updated!');
      setNewPassword('');
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout failed:', error);
      return;
    }
    navigate('/', { replace: true });
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 639px) {
        .mobile-only {
          display: block !important;
        }
        .desktop-only {
          display: none !important;
        }
      }
      @media (min-width: 640px) {
        .mobile-only {
          display: none !important;
        }
        .desktop-only {
          display: flex !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF8F0 0%, #F5E6D3 100%)',
    }}>
      <header style={{ 
        background: '#800020',
        padding: '1rem 2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              background: 'rgba(255, 255, 255, 0.2)', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <IconUser size={22} color="white" />
            </div>
            <div>
              <Title order={3} style={{ color: 'white', margin: 0, fontWeight: 600 }}>
                Update Profile
              </Title>
              <Text size="xs" c="white" style={{ opacity: 0.8 }}>
                {nickname || 'Your Profile'}
              </Text>
            </div>
          </div>
          {/* Desktop Navigation */}
          <Group spacing="md" className="desktop-only">
            <Button 
              variant="subtle" 
              component={Link} 
              to="/about" 
              size="sm"
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              About
            </Button>
            <Button 
              variant="subtle" 
              component={Link} 
              to="/list" 
              size="sm"
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              List
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              size="sm"
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
            >
              <IconLogout size={16} style={{ marginRight: '6px' }} />
              Log out
            </Button>
          </Group>

          {/* Mobile Navigation */}
          <Menu position="bottom-end" shadow="md" className="mobile-only">
            <Menu.Target>
              <Button variant="subtle" size="sm" style={{ color: 'white', padding: '8px' }}>
                <IconUser size={20} />
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item component={Link} to="/about">About</Menu.Item>
              <Menu.Item component={Link} to="/list">List</Menu.Item>
              <Menu.Item onClick={() => handleLogout()}>Log out</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </header>

      <Container size="md" py="xl">
        <Paper 
          shadow="lg" 
          radius="xl" 
          p="xl"
          style={{ 
            background: 'white',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Stack spacing="xl">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  background: '#800020', 
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px 0 rgba(128, 0, 32, 0.4)',
                }}>
                  <IconUser size={24} color="white" />
                </div>
                <div>
                  <Title order={3} style={{ color: '#1f2937', margin: 0, fontWeight: 600 }}>
                    Change Display Name
                  </Title>
                  <Text size="sm" c="neutral.5">Update how your name appears in the app</Text>
                </div>
              </div>

              <form onSubmit={handleUpdateNickname}>
                <Stack spacing="md">
                  <TextInput
                    value={nickname}
                    onChange={(e) => setNickname(e.currentTarget.value)}
                    placeholder="New display name"
                    required
                    onFocus={() => setNicknameFocused(true)}
                    onBlur={() => setNicknameFocused(false)}
                    leftSection={<IconUser size={18} style={{ color: nicknameFocused ? '#800020' : '#9ca3af' }} />}
                    style={{ 
                      borderRadius: '12px',
                      borderColor: nicknameFocused ? '#800020' : '#e5e7eb',
                      boxShadow: nicknameFocused ? '0 0 0 3px rgba(128, 0, 32, 0.1)' : 'none',
                    }}
                  />
                  <Button 
                    type="submit" 
                    size="sm"
                    style={{ 
                      background: '#800020',
                      boxShadow: '0 4px 14px 0 rgba(128, 0, 32, 0.4)',
                      fontWeight: 600,
                    }}
                  >
                    <IconUpload size={16} style={{ marginRight: '6px' }} />
                    Save Changes
                  </Button>
                </Stack>
              </form>
              
              {messageName && (
                <Text size="sm" mt="md" c={messageName.includes('updated') ? 'green.6' : 'red.6'} style={{ fontWeight: 500 }}>
                  {messageName}
                </Text>
              )}
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  background: '#800020', 
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px 0 rgba(128, 0, 32, 0.4)',
                }}>
                  <IconLock size={24} color="white" />
                </div>
                <div>
                  <Title order={3} style={{ color: '#1f2937', margin: 0, fontWeight: 600 }}>
                    Change Password
                  </Title>
                  <Text size="sm" c="neutral.5">Secure your account with a new password</Text>
                </div>
              </div>

              <form onSubmit={handleUpdatePassword}>
                <Stack spacing="md">
                  <PasswordInput
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.currentTarget.value)}
                    placeholder="New password"
                    required
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    leftSection={<IconLock size={18} style={{ color: passwordFocused ? '#667eea' : '#9ca3af' }} />}
                    style={{ 
                      borderRadius: '12px',
                      borderColor: passwordFocused ? '#667eea' : '#e5e7eb',
                      boxShadow: passwordFocused ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none',
                    }}
                  />
                  <Text size="xs" c="neutral.4">
                    Password must be at least 8 characters with at least one uppercase letter and one number
                  </Text>
                  <Button 
                    type="submit" 
                    size="sm"
                    style={{ 
                      background: '#800020',
                      boxShadow: '0 4px 14px 0 rgba(128, 0, 32, 0.4)',
                      fontWeight: 600,
                    }}
                  >
                    <IconUpload size={16} style={{ marginRight: '6px' }} />
                    Update Password
                  </Button>
                </Stack>
              </form>
              
              {messagePassword && (
                <Text size="sm" mt="md" c={messagePassword.includes('updated') ? 'green.6' : 'red.6'} style={{ fontWeight: 500 }}>
                  {messagePassword}
                </Text>
              )}
            </div>
          </Stack>
        </Paper>
      </Container>
    </div>
  );
}