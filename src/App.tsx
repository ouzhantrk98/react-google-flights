import React, { useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import FlightSearch from './components/FlightSearch';
import FlightResults from './components/FlightResults';
import { Flight, SearchParams } from './types/flight';
import { searchFlights } from './services/api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8',
    },
    background: {
      default: '#202124',
      paper: '#202124',
    },
  },
});

function App() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (params: SearchParams) => {
    try {
      setLoading(true);
      const results = await searchFlights(params);
      setFlights(results);
    } catch (error) {
      console.error('Error searching flights:', error);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <FlightSearch onSearch={handleSearch} />
        <FlightResults flights={flights} loading={loading} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
