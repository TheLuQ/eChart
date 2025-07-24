import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import App from './App.tsx'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <StrictMode>
      <App />
    </StrictMode>
  </ThemeProvider>,
)
