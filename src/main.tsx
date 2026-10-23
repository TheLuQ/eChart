import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import './index.css'
import { AppBar, Box, Button, createTheme, CssBaseline, ThemeProvider, Toolbar, Typography } from '@mui/material';
import App from './App.tsx'
import Events from './Events.tsx'
import Event from './Event.tsx'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <StrictMode>
      <BrowserRouter>
        <AppBar position='absolute' sx={{ mb: 2 }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, ml: 2 }}>
              <Typography variant="h4" component="div">
                eChart
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                GOS
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button color="inherit" component={Link} to="/bands/gos">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/bands/gos/events">
                Events
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<Navigate to="/bands/gos" replace />} />
          <Route path="/bands/:bandId" element={<App />} />
          <Route path="/bands/:bandId/events" element={<Events />} />
          <Route path="/bands/:bandId/events/:eventId" element={<Event />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  </ThemeProvider>,
)
