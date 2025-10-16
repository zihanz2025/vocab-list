import { BrowserRouter as Router } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import AppContent from './component/AppContent';

export default function App() {
  return (
    <MantineProvider
      theme={{
        colors: {
          mode: [
            "#FFFFFF", "#E3E3E3", "#C7C7C7", "#ABABAB", "#8F8F8F",
            "#666565ff", "#575757", "#3B3B3B", "#1F1F1F", "#000000"
          ],
        },
        primaryColor: 'mode',
        defaultRadius: 'xs',
      }}
      defaultColorScheme="light"
    >
      <Router basename="/vocab-list">
        <AppContent />
      </Router>
    </MantineProvider>
  );
}
