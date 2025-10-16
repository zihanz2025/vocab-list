import { useState, useEffect } from 'react';
import { supabase } from '../supaBaseClient';
import { TextInput, PasswordInput, Button, Group, Text,Stack, Container, Space, Title, Grid} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const [nickname, setNickname] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [messageName, setMessageName] = useState(''); 
  const [messagePassword, setMessagePassword] = useState(''); 
  const navigate = useNavigate();

  // Load nickname on mount
  useEffect(() => {
    async function fetchUser(){
      const { data: { user }, userError } = await supabase.auth.getUser();
      if (!user || userError) console.log('Error fetching user info:', userError);
      const userId = user.id;
      const { data, error } = await supabase
      .from('profiles') // replace with your user table name
      .select('nickname')
      .eq('id', userId)
      .single();

    if (error) console.log('Error fetching user info:', error);
    else{ 
        setNickname(data.nickname);}
    }
    fetchUser();
  }, []);

  // Validate new password
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

  // Update nickname
  const handleUpdateNickname = async (e) => {
    e.preventDefault();
    setMessagePassword('');
    const { error } = await supabase.auth.updateUser({
      data: { display_name: nickname },
    });
    if (error) setMessageName(error.message);
    else setMessageName('Nickname updated!' );
  };

  // Update password
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

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) setMessagePassword(updateError.message);
    else {
      setMessagePassword( 'Password updated!');
      setNewPassword('');
    }
  };

  //logout
    const handleLogout = async () => {

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout failed:', error);
      return;
    }
    navigate('/', { replace: true });
  };

  return (
    <div style={{ display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', 
    background: 'linear-gradient(180deg, #fffdfdff 0%, #bab8b8ff 100%)' }}>
        <Stack style={{height:'100%', width: '90%'}}>
        <Group justify="space-between" style={{ height:'9%' }}>
          <Title order={3}>Upate Profile</Title>
          <Group>
          <Button variant='subtle' component={Link} to="/about" size="sm" >
              About
          </Button>
          <Button variant='subtle' component={Link} to="/list" size="sm" >
              List
            </Button>
          <Button variant='subtle'  onClick={handleLogout}>
            Logout
          </Button>
          </Group>
        </Group>
        <Space h="lg" />
        <Container style={{height:'91%', width:"50%"}}>
        <form onSubmit={handleUpdateNickname}>
            <Stack>
                <Title order={4}>Change display name</Title>
                <Grid> 
                    <Grid.Col span="auto">
                        <TextInput
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="new display name" required/>
                    </Grid.Col>
                    <Grid.Col span="content">
                        <Button type="submit" size="sm">Save</Button>
                    </Grid.Col>
                </Grid>
            </Stack>
        </form>
        {messageName && (
            <Text size="sm" mt="md" c="#8F8F8F">
                {messageName}
                </Text>
            )}
        <Space h="xl" />
        
        <form onSubmit={handleUpdatePassword}>
            <Stack>
                <Title order={4}>Change password</Title>
                <Grid> 
                    <Grid.Col span="auto">
                        <PasswordInput
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="new password" required/>
                    </Grid.Col>
                    <Grid.Col span="content">
                        <Button type="submit" size="sm">Save</Button>
                    </Grid.Col>
                </Grid>
            </Stack>
        </form>
        {messagePassword && (
            <Text size="sm" mt="md" c="#8F8F8F">
                {messagePassword}
                </Text>
            )}

        </Container>
        </Stack>

    </div>
    
  );
}
