import { Container, Title, Text, List, ThemeIcon, Paper, Group, Button } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <Container size="md" py="xl">
      <Title order={2} mb="md">
        About & Use Guide
      </Title>

      <Text mb="md">
        Welcome to <strong>Le Vocabulaire</strong>! 
        <br />
        I am learning French and wanted a word list app tailored to my needs, so I built this simple app to help me track and review vocabulary.
        <br />
        Here you can add your own words that you feel worth writing down, and track how often you review each word to aid your learning process. To avoid overcomplicating the storage
        and input of information, this app refers to WordReference for specific word usages and verb conjugations, which is the dictionary I find most helpful to my study.
      </Text>

      <Paper shadow="sm" p="md" mb="xl">
        <Title order={4} mb="sm">
          Key Features
        </Title>
        <List
          spacing="sm"
          size="sm"
          icon={
            <ThemeIcon color="ocean" size={20} radius="xl">
              <IconCheck size={12} />
            </ThemeIcon>
          }
        >
          <List.Item>Add, edit, and delete your vocabulary words.</List.Item>
          <List.Item>Organize words by categories (noun, verb, adjective, etc.).</List.Item>
          <List.Item>Search for words quickly and locate them in your list.</List.Item>
          <List.Item>Quickly look up definitions and verb conjugations via WordReference links.</List.Item>
          <List.Item>Each look-up for word definition augments your viewcount. 
            If you find yourself looking for some words for a high frequency, maybe take some time to properly look at them.</List.Item>
        </List>
      </Paper>

      <Group position="center" mt="xl">
        <Button component={Link} to="/" color="cyan" size="md">
          Go to Your List
        </Button>
      </Group>
    </Container>
  );
}
