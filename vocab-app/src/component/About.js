import { Container, Title, Text, List, ThemeIcon, Paper, Group, Button, Space, Stack } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div style={{ display: 'flex',flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', height: '100vh', 
        background: 'linear-gradient(180deg, #fffdfdff 0%, #bab8b8ff 100%)' }}>
          <Stack style={{height:'100%', width: '90%'}}>
            <Group justify="space-between" style={{ height:'9%' }}>
              <Title order={3}>About & User Guide</Title>
              <Group>
                <Button variant='subtle' component={Link} to="/list" size="sm" >Go to List</Button>
              </Group>
            </Group>
            <Space h="lg" />
            <Container size="md" py="xl">
              <Title order={4} mb="sm">Welcome to <strong>Le Vocabulaire</strong>! </Title>
              <Text mb="md">
                I am learning French and wanted a word list app tailored to my needs, so I built this simple app to help me track and review vocabulary.
                <br />
                Here you can add your own words that you feel worth writing down, and track how often you review each word to aid your learning process. To avoid overcomplicating the storage
                and input of information, this app refers to WordReference for specific word usages and verb conjugations, which is the dictionary I find most helpful to my study.
              </Text>
              <Title order={4} mb="sm">Key Features</Title>
              <List spacing="sm" size="sm">
                <List.Item>Add, edit, and delete your words and notes.</List.Item>
                <List.Item>View words by categories and view counts.</List.Item>
                <List.Item>Search for words quickly and locate them in your list.</List.Item>
                <List.Item>Click on each word to go to its definition page on WordReference.</List.Item>
                <List.Item>Click on verb category to go to its conjugation page on WordReference.</List.Item>
                <List.Item>Each click on word definition augments your view count. High view count indicates a necessity of memorizing certain word.</List.Item>
              </List>
            </Container>
          </Stack>
        </div>
    
  );
}
