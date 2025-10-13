import { Link } from 'react-router-dom';
import { Button, Container, Title, Text, Paper, Group } from '@mantine/core';

export default function Welcome() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f7fa 100%)',
      }}
    >
      <Container size={480} px="md">
        <Paper withBorder shadow="sm" radius="md" p="xl" style={{ textAlign: 'center' }}>
          <Title order={1} mb="sm">
            Welcome to VocabList
          </Title>

          <Text size="sm" c="dimmed" mb="md">
            Build your personalized French vocabulary list. <br />
            Review, track, and expand your words easily.
          </Text>

          <Group justify="center" mt="xl">
            <Button component={Link} to="/signup" size="md">
              Sign Up
            </Button>
            <Button component={Link} to="/login" size="md" variant="outline">
              Login
            </Button>
          </Group>
        </Paper>
      </Container>
    </div>
  );
}
