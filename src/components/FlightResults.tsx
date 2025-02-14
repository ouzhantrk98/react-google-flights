import React, { useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Collapse,
  Paper,
} from '@mui/material';
import { Flight } from '../types/flight';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import { styled } from '@mui/material/styles';

interface Props {
  flights: Flight[];
  loading: boolean;
}

const AIRLINE_CODES: { [key: string]: string } = {
  'Turkish Airlines': 'TK',
  'Lufthansa': 'LH',
  'Norse Atlantic UK': 'N0',
  'SunExpress': 'XQ',
  'United Airlines': 'UA',
  'American Airlines': 'AA',
  'Delta Air Lines': 'DL',
  'British Airways': 'BA',
  'Air France': 'AF',
  'KLM': 'KL',
  'Emirates': 'EK',
  'Qatar Airways': 'QR',
  'Etihad Airways': 'EY',
  'Singapore Airlines': 'SQ',
};

const FlightCard = styled(Paper)(({ theme }) => ({
  padding: '16px',
  backgroundColor: '#202124',
  marginBottom: '12px',
  borderRadius: '12px',
  border: '1px solid rgba(95, 99, 104, 0.3)',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: '#282a2d',
  },
}));

const MainContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
});

const FlightInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  flex: 1,
});

const TimeDisplay = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#e8eaed',
});

const StopInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  flex: 1,
  maxWidth: '180px',
});

const PriceSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const FlightResults: React.FC<Props> = ({ flights, loading }) => {
  const [expandedFlights, setExpandedFlights] = useState<string[]>([]);
  const [failedLogos, setFailedLogos] = useState<Set<string>>(new Set());

  const toggleFlightDetails = (flightId: string) => {
    setExpandedFlights(prev =>
      prev.includes(flightId)
        ? prev.filter(id => id !== flightId)
        : [...prev, flightId]
    );
  };

  const formatTime = (timeString: string) => {
    try {
      // If timeString is already in HH:mm format, return as is
      if (/^\d{2}:\d{2}$/.test(timeString)) {
        return timeString;
      }
      
      // If it's a date string, format it
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString; // Return original string if formatting fails
    }
  };

  const getAirlineCode = (airlineName: string, flightNumber: string): string => {
    // First try to get the code from our mapping
    if (AIRLINE_CODES[airlineName]) {
      return AIRLINE_CODES[airlineName];
    }
    
    // If not found in mapping, try to extract from flight number
    const codeMatch = flightNumber.match(/^([A-Z]{2}|[A-Z]\d|\d[A-Z])/);
    if (codeMatch) {
      return codeMatch[0];
    }
    
    // If still no code found, try to extract first two letters from airline name
    const nameMatch = airlineName.match(/^([A-Za-z\s]+)/);
    if (nameMatch) {
      return nameMatch[1].trim().slice(0, 2).toUpperCase();
    }
    
    return '';
  };

  const getAirlineLogo = (airline: string, flightNumber: string) => {
    const airlineCode = getAirlineCode(airline, flightNumber);
    
    // If no valid code found or logo previously failed, show icon
    if (!airlineCode || failedLogos.has(airlineCode)) {
      return (
        <AirplanemodeActiveIcon 
          sx={{ 
            width: 35, 
            height: 35, 
            color: '#9aa0a6' 
          }} 
        />
      );
    }

    // Try both light and dark theme versions
    const logoUrls = [
      `https://www.gstatic.com/flights/airline_logos/70px/${airlineCode}.png`,
      `https://www.gstatic.com/flights/airline_logos/70px/dark/${airlineCode}.png`
    ];

    return (
      <Box
        component="img"
        src={logoUrls[0]}
        alt={airline}
        sx={{
          width: '35px',
          height: '35px',
          objectFit: 'contain',
        }}
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
          const target = e.target as HTMLImageElement;
          const currentIndex = logoUrls.indexOf(target.src);
          
          if (currentIndex < logoUrls.length - 1) {
            // Try dark theme version if light theme fails
            target.src = logoUrls[currentIndex + 1];
          } else {
            // If both versions fail, mark this airline code as failed
            setFailedLogos(prev => new Set(prev).add(airlineCode));
            // Replace with icon
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = '';
              const icon = document.createElement('div');
              icon.style.width = '35px';
              icon.style.height = '35px';
              icon.style.display = 'flex';
              icon.style.alignItems = 'center';
              icon.style.justifyContent = 'center';
              const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
              svg.setAttribute('viewBox', '0 0 24 24');
              svg.style.width = '24px';
              svg.style.height = '24px';
              svg.style.fill = '#9aa0a6';
              svg.innerHTML = `<path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>`;
              icon.appendChild(svg);
              parent.appendChild(icon);
            }
          }
        }}
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', mt: 4 }}>
        <CircularProgress size={40} thickness={4} sx={{ color: '#8ab4f8' }} />
        <Typography sx={{ mt: 2, color: '#e8eaed' }}>Finding best flights...</Typography>
      </Box>
    );
  }

  if (!flights.length) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" sx={{ color: '#e8eaed', mb: 1 }}>
          No flights found
        </Typography>
        <Typography color="#9aa0a6">
          Try adjusting your search criteria or selecting different dates.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, mt: 4, maxWidth: '1032px', margin: '0 auto' }}>
      <Typography variant="h6" sx={{ mb: 3, color: '#e8eaed', fontSize: '20px', fontWeight: 400 }}>
        {flights.length} {flights.length === 1 ? 'flight' : 'flights'} found
      </Typography>

      {flights.map((flight) => (
        <FlightCard key={flight.id} elevation={0}>
          <MainContent onClick={() => toggleFlightDetails(flight.id)}>
            <FlightInfo>
              {/* Airline Logo */}
              <Box sx={{ 
                minWidth: '40px', 
                height: '40px',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                {getAirlineLogo(flight.airline, flight.flightNumber)}
              </Box>

              {/* Flight Details */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Typography sx={{ color: '#9aa0a6', fontSize: '14px' }}>
                  {flight.airline} • {flight.flightNumber}
                </Typography>
                <TimeDisplay>
                  <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>
                    {formatTime(flight.departure.time)}
                  </Typography>
                  <Typography sx={{ color: '#9aa0a6', mx: 1 }}>–</Typography>
                  <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>
                    {formatTime(flight.arrival.time)}
                  </Typography>
                </TimeDisplay>
              </Box>

              {/* Duration and Stops */}
              <StopInfo>
                <Typography sx={{ color: '#e8eaed', fontSize: '14px' }}>
                  {flight.duration}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '8px',
                  color: flight.stops === 0 ? '#81c995' : '#9aa0a6'
                }}>
                  <Typography sx={{ fontSize: '14px' }}>
                    {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop`}
                  </Typography>
                  {flight.stops > 0 && (
                    <Typography sx={{ fontSize: '14px', color: '#9aa0a6' }}>
                      {flight.stopDetails?.[0]?.airport}
                    </Typography>
                  )}
                </Box>
              </StopInfo>

              {/* CO2 Emissions */}
              {flight.eco && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '4px',
                  color: flight.eco.comparison?.includes('-') ? '#81c995' : '#e8eaed'
                }}>
                  <Typography sx={{ fontSize: '14px' }}>
                    {flight.eco.emissions}
                  </Typography>
                  <Typography sx={{ fontSize: '14px' }}>
                    {flight.eco.comparison}
                  </Typography>
                  <IconButton size="small" sx={{ color: 'inherit' }}>
                    <InfoOutlinedIcon sx={{ fontSize: '16px' }} />
                  </IconButton>
                </Box>
              )}
            </FlightInfo>

            {/* Price */}
            <PriceSection>
              <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ 
                  color: '#e8eaed', 
                  fontSize: '20px', 
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  €{flight.price}
                </Typography>
              </Box>
              <IconButton 
                size="small" 
                sx={{ color: '#9aa0a6' }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFlightDetails(flight.id);
                }}
              >
                <ExpandMoreIcon sx={{
                  transform: expandedFlights.includes(flight.id) ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease'
                }} />
              </IconButton>
            </PriceSection>
          </MainContent>

          {/* Expanded Details */}
          <Collapse in={expandedFlights.includes(flight.id)}>
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(95, 99, 104, 0.3)' }}>
              <Typography sx={{ color: '#e8eaed', fontSize: '14px', mb: 2 }}>
                Flight details
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Departure Details */}
                <Box sx={{ display: 'flex', gap: '16px' }}>
                  <Box sx={{ minWidth: '40px', display: 'flex', justifyContent: 'center' }}>
                    <FlightTakeoffIcon sx={{ color: '#9aa0a6', fontSize: '20px' }} />
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#e8eaed', fontSize: '14px', mb: 0.5 }}>
                      {flight.departure.time}
                    </Typography>
                    <Typography sx={{ color: '#9aa0a6', fontSize: '14px' }}>
                      {flight.departure.city} ({flight.departure.airport})
                    </Typography>
                  </Box>
                </Box>

                {/* Flight Duration */}
                <Box sx={{ display: 'flex', gap: '16px' }}>
                  <Box sx={{ minWidth: '40px' }} />
                  <Typography sx={{ color: '#9aa0a6', fontSize: '14px' }}>
                    {flight.duration}
                  </Typography>
                </Box>

                {/* Arrival Details */}
                <Box sx={{ display: 'flex', gap: '16px' }}>
                  <Box sx={{ minWidth: '40px', display: 'flex', justifyContent: 'center' }}>
                    <FlightTakeoffIcon sx={{ 
                      color: '#9aa0a6', 
                      fontSize: '20px',
                      transform: 'rotate(180deg)'
                    }} />
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#e8eaed', fontSize: '14px', mb: 0.5 }}>
                      {flight.arrival.time}
                    </Typography>
                    <Typography sx={{ color: '#9aa0a6', fontSize: '14px' }}>
                      {flight.arrival.city} ({flight.arrival.airport})
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </FlightCard>
      ))}
    </Box>
  );
};

export default FlightResults; 