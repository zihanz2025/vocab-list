import { Link } from 'react-router-dom';
import { Button, Container, Title, Text, Paper, Group, Box, Badge } from '@mantine/core';
import { IconBook2, IconSparkles, IconArrowRight } from '@tabler/icons-react';

export default function Welcome() {
  return (
    <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FFF8F0 0%, #F5E6D3 100%)',
          padding: '1rem',
        }}
      >
      <Container size="lg" px="md">
        <Paper 
          shadow="xl" 
          radius="xl" 
          p="xl" 
          style={{ 
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          <Box mb="lg">
            <div 
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto',
              background: '#800020',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 40px rgba(128, 0, 32, 0.4)',
            }}
          >
              <IconBook2 size={40} color="white" />
            </div>
          </Box>

          <Title order={1} mb="sm" style={{ fontSize: '2.25rem', fontWeight: 700, color: '#800020' }}>
            Le Vocabulaire
          </Title>

          <Badge 
            variant="light" 
            color="secondary" 
            size="sm" 
            mb="md"
            style={{ padding: '4px 16px', fontWeight: 500 }}
          >
            <IconSparkles size={14} style={{ marginRight: '6px' }} />
            Your Personalized French Vocabulary List
          </Badge>

          <Text size="md" c="neutral.6" mb="xl" style={{ lineHeight: '1.6' }}>
            Build your personalized French vocabulary list. <br />
            Review, track, and expand your knowledge with ease.
          </Text>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <Link to="/about" style={{ textDecoration: 'none', minWidth: '90px', flexShrink: 0 }}>
              <button 
                style={{ 
                  background: 'transparent',
                  color: '#800020',
                  border: '1px solid #800020',
                  fontWeight: 500,
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  width: '100%',
                  boxSizing: 'border-box',
                  minHeight: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                About
              </button>
            </Link>
            <Link to="/signup" style={{ textDecoration: 'none', minWidth: '90px', flexShrink: 0 }}>
              <button 
                style={{ 
                  background: '#800020',
                  color: '#ffffff',
                  fontWeight: 600,
                  borderRadius: '12px',
                  boxShadow: '0 4px 14px 0 rgba(128, 0, 32, 0.4)',
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  width: '100%',
                  boxSizing: 'border-box',
                  minHeight: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Sign Up
              </button>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none', minWidth: '90px', flexShrink: 0 }}>
              <button 
                style={{ 
                  background: '#800020',
                  color: '#ffffff',
                  fontWeight: 600,
                  borderRadius: '12px',
                  boxShadow: '0 4px 14px 0 rgba(128, 0, 32, 0.4)',
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  width: '100%',
                  boxSizing: 'border-box',
                  minHeight: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Login
              </button>
            </Link>
          </div>
        </Paper>
      </Container>
    </div>
  );
}
