import { BrowserRouter as Router } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import AppContent from './component/AppContent';

export default function App() {
  return (
    <MantineProvider
      theme={{
        colors: {
          primary: [
            '#f0f4f8', '#d9e2ec', '#bcccdc', '#9fb3c8',
            '#829ab1', '#627d98', '#486581', '#334e68',
            '#243b53', '#102a43'
          ],
          secondary: [
            '#FDF5E6', '#F5E6D3', '#EBD7C0', '#E1C8AD',
            '#D7B99A', '#CDA987', '#C39974', '#B98961',
            '#AF794E', '#A5693B'
          ],
          accent: [
            '#F5E6E6', '#EBCCCC', '#E1B2B2', '#D79898',
            '#CD7E7E', '#C36464', '#B94A4A', '#AF3030',
            '#A51616', '#9B0000'
          ],
          neutral: [
            '#fafafa', '#f5f5f5', '#e5e5e5', '#d4d4d4',
            '#a3a3a3', '#737373', '#525252', '#404040',
            '#262626', '#171717'
          ]
        },
        primaryColor: 'primary',
        primaryShade: 6,
        defaultRadius: 'md',
        fontFamily: '"Inter", "Segoe UI", sans-serif',
        fontSizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          md: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          xxl: '1.5rem',
        },
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
        },
      }}
      defaultColorScheme="light"
    >
      <Router basename="/vocab-list">
        <AppContent />
      </Router>
    </MantineProvider>
  );
}
