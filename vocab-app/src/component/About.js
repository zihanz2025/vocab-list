import { Container, Title, Text, List, Paper, Group, Button, Stack, Box } from '@mantine/core';
import { IconCheck, IconBook2, IconArrowLeft } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export default function About() {
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
              <IconBook2 size={22} color="white" />
            </div>
            <div>
              <Title order={3} style={{ color: 'white', margin: 0, fontWeight: 600 }}>
                About & User Guide
              </Title>
            </div>
          </div>
          <Group spacing="md">
            <Button 
              variant="subtle" 
              component={Link} 
              to="/list" 
              size="sm"
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              List
            </Button>
          </Group>
        </div>
      </header>

      <Container size="lg" py="xl">
        <Paper 
          shadow="lg" 
          radius="xl" 
          p="xl"
          style={{ 
            background: 'white',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Stack spacing="lg">
            <div>
              <Title order={2} style={{ 
                fontSize: '1.75rem', 
                fontWeight: 700, 
                background: 'linear-gradient(135deg, #800020 0%, #A52A2A 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
              }}>
                Welcome to <strong>Le Vocabulaire</strong>!
              </Title>
              <Text size="md" c="neutral.6" style={{ lineHeight: '1.7', marginTop: '1rem' }}>
                I am learning French and wanted a word list app tailored to my needs, so I built this simple app to help me track and review vocabulary.
              </Text>
              <Text size="md" c="neutral.6" style={{ lineHeight: '1.7' }}>
                Here you can add your own words that you feel worth writing down, and track how often you review each word to aid your learning process. To avoid overcomplicating the storage
                and input of information, this app refers to WordReference for specific word usages and verb conjugations, which is the dictionary I find most helpful to my study.
              </Text>
            </div>

            <div>
              <Title order={3} style={{ color: '#1f2937', fontWeight: 600 }}>
                Key Features
              </Title>
              <List spacing="sm" size="sm" style={{ marginTop: '1rem' }}>
                <List.Item style={{ padding: '6px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                  <Text size="sm" c="neutral.7">Add, edit, and delete your words and notes.</Text>
                </List.Item>
                <List.Item style={{ padding: '6px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                  <Text size="sm" c="neutral.7">View words by categories and view counts.</Text>
                </List.Item>
                <List.Item style={{ padding: '6px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                  <Text size="sm" c="neutral.7">Search for words quickly and locate them in your list.</Text>
                </List.Item>
                <List.Item style={{ padding: '6px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                  <Text size="sm" c="neutral.7">Click on each word to go to its definition page on WordReference.</Text>
                </List.Item>
                <List.Item style={{ padding: '6px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                  <Text size="sm" c="neutral.7">Click on verb category to go to its conjugation page on WordReference.</Text>
                </List.Item>
                <List.Item style={{ padding: '6px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                  <Text size="sm" c="neutral.7">Each click on word definition augments your view count. High view count indicates a necessity of memorizing certain word.</Text>
                </List.Item>
              </List>
            </div>

          </Stack>
        </Paper>
      </Container>
    </div>
  );
}