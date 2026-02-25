import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
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
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h4" component="div" sx={{ mx: 2 }}>
              eChart
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/events">
                Events
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:eventId" element={<Event />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  </ThemeProvider>,
)
