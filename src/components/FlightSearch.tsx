import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Paper,
  InputBase,
  styled,
  Popover,
  Divider,
  Menu,
  MenuItem,
  List,
} from '@mui/material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { SearchParams, CabinClass, Airport } from '../types/flight';
import { getAirports } from '../services/api';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SearchIcon from '@mui/icons-material/Search';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import PersonIcon from '@mui/icons-material/Person';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const SearchContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  maxWidth: '1032px',
  margin: '0 auto',
  background: '#36373a',
  borderRadius: '12px',
  color: '#fff',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
});

const HeaderImage = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 0',
  background: '#202124',
  width: '100%',
  '& img': {
    width: '1200px',
    maxWidth: '90%',
    height: 'auto',
    marginBottom: '24px',
  },
  '& h1': {
    color: '#e8eaed',
    fontSize: '44px',
    fontWeight: 400,
    margin: 0,
    fontFamily: 'Google Sans, Roboto, Arial, sans-serif',
  },
});

const SearchBox = styled(Box)({
  position: 'relative',
  width: '100%',
  padding: '24px',
});

const SearchField = styled(Paper)({
  backgroundColor: 'rgba(54, 55, 56, 0.7)',
  border: '1px solid rgba(91, 93, 97, 0.7)',
  borderRadius: '8px',
  height: '56px',
  padding: '8px 16px',
  color: '#fff',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    borderColor: '#6e6e6e',
    backgroundColor: 'rgba(64, 64, 64, 0.8)',
  },
  '&.focused': {
    borderColor: '#8ab4f8',
    backgroundColor: 'rgba(54, 55, 56, 0.9)',
  },
});

const SearchButton = styled(Button)({
  backgroundColor: '#8ab4f8',
  color: '#202124',
  borderRadius: '24px',
  padding: '10px 24px',
  textTransform: 'none',
  fontSize: '15px',
  fontWeight: 500,
  height: '48px',
  minWidth: '120px',
  '&:hover': {
    backgroundColor: '#a4c1f5',
  },
});

const HeaderOptions = styled(Box)({
  display: 'flex',
  gap: '24px',
  marginBottom: '20px',
  '& .MuiTypography-root': {
    color: '#e8eaed',
    fontSize: '14px',
    fontWeight: 500,
  },
});

const SearchFields = styled(Box)({
  display: 'flex',
  gap: '8px',
  marginBottom: '24px',
  alignItems: 'center',
});

const SwapButton = styled(IconButton)({
  width: '40px',
  height: '40px',
  backgroundColor: 'rgba(54, 55, 56, 0.7)',
  borderRadius: '50%',
  margin: '0 -20px',
  zIndex: 1,
  border: '1px solid rgba(91, 93, 97, 0.7)',
  padding: 0,
  '&:hover': {
    backgroundColor: 'rgba(64, 64, 64, 0.8)',
  },
});

const AirportList = styled(List)({
  position: 'absolute',
  width: '100%',
  maxHeight: '400px',
  overflowY: 'auto',
  backgroundColor: '#202124',
  borderRadius: '8px',
  border: '1px solid rgba(91, 93, 97, 0.7)',
  marginTop: '4px',
  zIndex: 1000,
  padding: '8px 0',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(154, 160, 166, 0.5)',
    borderRadius: '4px',
  },
});

const LocationItem = styled(Box)({
  padding: '12px 16px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(64, 64, 64, 0.8)',
  },
});

const AirportItem = styled(Box)({
  padding: '8px 16px 8px 40px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(64, 64, 64, 0.8)',
  },
});

const PassengerPopover = styled(Popover)({
  '& .MuiPaper-root': {
    backgroundColor: '#363738',
    color: '#fff',
    width: '300px',
    border: '1px solid #5b5d61',
  },
});

const PassengerTypeContainer = styled(Box)({
  padding: '16px',
  '& + &': {
    borderTop: '1px solid #5b5d61',
  },
});

const CounterButton = styled(IconButton)({
  backgroundColor: '#363738',
  border: '1px solid #5b5d61',
  borderRadius: '4px',
  padding: '4px',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#404040',
  },
  '&.Mui-disabled': {
    backgroundColor: '#2a2b2c',
    color: '#5b5d61',
  },
});

type PassengerType = 'adult' | 'child' | 'infant' | 'lapInfant';

const CalendarContainer = styled(Box)({
  padding: '20px',
  backgroundColor: '#202124',
  color: '#fff',
  width: '700px',
});

const CalendarHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
});

const MonthContainer = styled(Box)({
  display: 'flex',
  gap: '40px',
});

const MonthGrid = styled(Box)({
  flex: 1,
});

const WeekDayHeader = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  textAlign: 'center',
  marginBottom: '8px',
  '& > div': {
    color: '#8a8c8e',
    fontSize: '12px',
    padding: '4px 0',
  },
});

const DaysGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '2px',
});

const DayCell = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'isToday' && prop !== 'isInRange',
})<{ isSelected?: boolean; isToday?: boolean; isInRange?: boolean }>(({ isSelected, isToday, isInRange }) => ({
  padding: '8px',
  textAlign: 'center',
  cursor: 'pointer',
  borderRadius: '4px',
  fontSize: '14px',
  color: isToday ? '#8ab4f8' : '#fff',
  backgroundColor: isSelected ? '#8ab4f8' : isInRange ? 'rgba(138, 180, 248, 0.2)' : 'transparent',
  '&:hover': {
    backgroundColor: isSelected ? '#8ab4f8' : '#404040',
  },
  '&.disabled': {
    color: '#5b5d61',
    cursor: 'default',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
}));

const NavigationButton = styled(IconButton)({
  color: '#fff',
  padding: '8px',
  '&:hover': {
    backgroundColor: '#404040',
  },
  '&.Mui-disabled': {
    color: '#5b5d61',
  },
});

const FlightSearch: React.FC<{
  onSearch: (params: SearchParams) => void;
}> = ({ onSearch }) => {
  const [roundTrip, setRoundTrip] = useState(true);
  const [from, setFrom] = useState<Airport | null>(null);
  const [to, setTo] = useState<Airport | null>(null);
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState<Airport[]>([]);
  const [toSuggestions, setToSuggestions] = useState<Airport[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [departDate, setDepartDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [cabinClass, setCabinClass] = useState<CabinClass>(CabinClass.ECONOMY);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [lapInfants, setLapInfants] = useState(0);
  const [tripTypeAnchor, setTripTypeAnchor] = useState<null | HTMLElement>(null);
  const [passengersAnchor, setPassengersAnchor] = useState<null | HTMLElement>(null);
  const [cabinClassAnchor, setCabinClassAnchor] = useState<null | HTMLElement>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerAnchor, setDatePickerAnchor] = useState<null | HTMLElement>(null);
  const [fromFieldFocused, setFromFieldFocused] = useState(false);
  const [toFieldFocused, setToFieldFocused] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedCabinClass, setSelectedCabinClass] = useState('Economy');

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (fromQuery.length >= 2) {
        const airports = await getAirports(fromQuery);
        setFromSuggestions(airports);
        setShowFromSuggestions(true);
      } else {
        setFromSuggestions([]);
        setShowFromSuggestions(false);
      }
    };
    fetchSuggestions();
  }, [fromQuery]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (toQuery.length >= 2) {
        const airports = await getAirports(toQuery);
        setToSuggestions(airports);
        setShowToSuggestions(true);
      } else {
        setToSuggestions([]);
        setShowToSuggestions(false);
      }
    };
    fetchSuggestions();
  }, [toQuery]);

  const handleSwapAirports = () => {
    const tempFrom = from;
    const tempFromQuery = fromQuery;
    setFrom(to);
    setFromQuery(toQuery);
    setTo(tempFrom);
    setToQuery(tempFromQuery);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !departDate) return;

    const searchParams: SearchParams = {
      from: from.code,
      to: to.code,
      date: format(departDate, 'yyyy-MM-dd'),
      adults: adults + children + infants + lapInfants,
      cabinClass,
      currency: 'USD'
    };

    if (roundTrip && returnDate) {
      searchParams.returnDate = format(returnDate, 'yyyy-MM-dd');
    }

    onSearch(searchParams);
  };

  const handlePassengerChange = (type: PassengerType, operation: 'increment' | 'decrement') => {
    const setters: Record<PassengerType, React.Dispatch<React.SetStateAction<number>>> = {
      adult: setAdults,
      child: setChildren,
      infant: setInfants,
      lapInfant: setLapInfants,
    };

    const values: Record<PassengerType, number> = {
      adult: adults,
      child: children,
      infant: infants,
      lapInfant: lapInfants,
    };

    const currentValue = values[type];
    const setValue = setters[type];

    if (operation === 'increment') {
      if (type === 'adult' && currentValue < 9) {
        setValue(currentValue + 1);
      } else if (type !== 'adult' && currentValue < 8) {
        setValue(currentValue + 1);
      }
    } else if (operation === 'decrement' && currentValue > (type === 'adult' ? 1 : 0)) {
      setValue(currentValue - 1);
    }
  };

  const totalPassengers = adults + children + infants + lapInfants;

  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  const getMonthData = (baseDate: Date) => {
    const month = baseDate.getMonth();
    const year = baseDate.getFullYear();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const daysInMonth = lastDay.getDate();

    return {
      month,
      year,
      startOffset,
      daysInMonth,
    };
  };

  const isDateSelected = (date: Date) => {
    if (!departDate && !returnDate) return false;
    const dateStr = format(date, 'yyyy-MM-dd');
    const departStr = departDate ? format(departDate, 'yyyy-MM-dd') : '';
    const returnStr = returnDate ? format(returnDate, 'yyyy-MM-dd') : '';
    return dateStr === departStr || dateStr === returnStr;
  };

  const isDateInRange = (date: Date) => {
    if (!departDate || !returnDate) return false;
    return date > departDate && date < returnDate;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  };

  const handleDateClick = (date: Date) => {
    if (!departDate || (departDate && returnDate)) {
      setDepartDate(date);
      setReturnDate(null);
    } else {
      if (date < departDate) {
        setDepartDate(date);
        setReturnDate(null);
      } else {
        setReturnDate(date);
        if (!roundTrip) {
          setShowDatePicker(false);
        }
      }
    }
  };

  const renderMonth = (baseDate: Date) => {
    const { month, year, startOffset, daysInMonth } = getMonthData(baseDate);
    const days = [];

    // Add empty cells for the offset
    for (let i = 0; i < startOffset; i++) {
      days.push(<Box key={`empty-${i}`} />);
    }

    // Add the days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isDisabled = date < new Date();

      days.push(
        <DayCell
          key={day}
          isSelected={isDateSelected(date)}
          isToday={isToday(date)}
          isInRange={isDateInRange(date)}
          className={isDisabled ? 'disabled' : ''}
          onClick={() => !isDisabled && handleDateClick(date)}
        >
          {day}
        </DayCell>
      );
    }

    return days;
  };

  const nextMonth = new Date(currentMonth);
  nextMonth.setMonth(currentMonth.getMonth() + 1);

  return (
    <>
      <HeaderImage>
        <img 
          src="https://www.gstatic.com/travel-frontend/animation/hero/flights_nc_dark_theme_4.svg" 
          alt="Flights illustration" 
        />
        <h1>Flights</h1>
      </HeaderImage>
      <SearchContainer>
        <SearchBox>
          <HeaderOptions>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5, 
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 }
            }} onClick={(e) => setTripTypeAnchor(e.currentTarget)}>
              <CompareArrowsIcon sx={{ color: '#e8eaed', width: 18, height: 18 }} />
              <Typography>{roundTrip ? 'Round trip' : 'One way'}</Typography>
              <KeyboardArrowDownIcon sx={{ color: '#e8eaed', width: 18, height: 18 }} />
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5, 
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 }
            }} onClick={(e) => setPassengersAnchor(e.currentTarget)}>
              <PersonIcon sx={{ color: '#e8eaed', width: 18, height: 18 }} />
              <Typography>{totalPassengers} passenger{totalPassengers !== 1 ? 's' : ''}</Typography>
              <KeyboardArrowDownIcon sx={{ color: '#e8eaed', width: 18, height: 18 }} />
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5, 
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 }
            }} onClick={(e) => setCabinClassAnchor(e.currentTarget)}>
              <Typography>{selectedCabinClass}</Typography>
              <KeyboardArrowDownIcon sx={{ color: '#e8eaed', width: 18, height: 18 }} />
            </Box>
          </HeaderOptions>

          <SearchFields>
            <Box sx={{ flex: 1, position: 'relative' }}>
              <SearchField className={fromFieldFocused ? 'focused' : ''}>
                <FlightTakeoffIcon sx={{ color: '#e8eaed', width: 20, height: 20, mr: 1.5 }} />
                <InputBase
                  placeholder="Where from?"
                  fullWidth
                  value={fromQuery}
                  onChange={(e) => setFromQuery(e.target.value)}
                  onFocus={() => setFromFieldFocused(true)}
                  onBlur={() => setTimeout(() => setFromFieldFocused(false), 200)}
                  sx={{ 
                    color: '#e8eaed', 
                    fontSize: '15px',
                    '& input::placeholder': {
                      color: '#9aa0a6',
                      opacity: 1
                    }
                  }}
                />
              </SearchField>
              {showFromSuggestions && fromSuggestions.length > 0 && (
                <AirportList>
                  {fromSuggestions.map((airport, index) => (
                    <React.Fragment key={airport.code}>
                      {index > 0 && <Divider sx={{ bgcolor: 'rgba(91, 93, 97, 0.7)' }} />}
                      <LocationItem onClick={() => {
                        setFrom(airport);
                        setFromQuery(airport.name);
                        setShowFromSuggestions(false);
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Box component="span" sx={{ 
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            bgcolor: 'rgba(154, 160, 166, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1.5
                          }}>
                            <Box component="span" sx={{ 
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              bgcolor: '#9aa0a6',
                              opacity: 0.8
                            }} />
                          </Box>
                          <Typography sx={{ 
                            color: '#e8eaed',
                            fontSize: '14px',
                            fontWeight: 500
                          }}>
                            {airport.name}
                          </Typography>
                        </Box>
                        <Typography sx={{ 
                          color: '#9aa0a6',
                          fontSize: '12px',
                          ml: 5.5
                        }}>
                          City in Turkey
                        </Typography>
                      </LocationItem>
                      <AirportItem onClick={() => {
                        setFrom(airport);
                        setFromQuery(`${airport.name} (${airport.code})`);
                        setShowFromSuggestions(false);
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Box component="span" sx={{ mr: 1.5 }}>
                            <FlightTakeoffIcon sx={{ color: '#9aa0a6', width: 16, height: 16 }} />
                          </Box>
                          <Box>
                            <Typography sx={{ 
                              color: '#e8eaed',
                              fontSize: '14px',
                              fontWeight: 500,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}>
                              {airport.name}
                              <Typography component="span" sx={{ 
                                color: '#9aa0a6',
                                fontSize: '12px',
                                fontWeight: 400
                              }}>
                                {airport.code}
                              </Typography>
                            </Typography>
                            <Typography sx={{ 
                              color: '#9aa0a6',
                              fontSize: '12px'
                            }}>
                              {airport.distance ? `${airport.distance} km to destination` : '30 km to destination'}
                            </Typography>
                          </Box>
                        </Box>
                      </AirportItem>
                    </React.Fragment>
                  ))}
                </AirportList>
              )}
            </Box>

            <SwapButton onClick={handleSwapAirports}>
              <SwapHorizIcon sx={{ color: '#e8eaed', width: 20, height: 20 }} />
            </SwapButton>

            <Box sx={{ flex: 1 }}>
              <SearchField className={toFieldFocused ? 'focused' : ''}>
                <FlightLandIcon sx={{ color: '#e8eaed', width: 20, height: 20, mr: 1.5 }} />
                <InputBase
                  placeholder="Where to?"
                  fullWidth
                  value={toQuery}
                  onChange={(e) => setToQuery(e.target.value)}
                  onFocus={() => setToFieldFocused(true)}
                  onBlur={() => setTimeout(() => setToFieldFocused(false), 200)}
                  sx={{ 
                    color: '#e8eaed', 
                    fontSize: '15px',
                    '& input::placeholder': {
                      color: '#9aa0a6',
                      opacity: 1
                    }
                  }}
                />
              </SearchField>
              {showToSuggestions && toSuggestions.length > 0 && (
                <AirportList>
                  {toSuggestions.map((airport, index) => (
                    <React.Fragment key={airport.code}>
                      {index > 0 && <Divider sx={{ bgcolor: 'rgba(91, 93, 97, 0.7)' }} />}
                      <LocationItem onClick={() => {
                        setTo(airport);
                        setToQuery(airport.name);
                        setShowToSuggestions(false);
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Box component="span" sx={{ 
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            bgcolor: 'rgba(154, 160, 166, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1.5
                          }}>
                            <Box component="span" sx={{ 
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              bgcolor: '#9aa0a6',
                              opacity: 0.8
                            }} />
                          </Box>
                          <Typography sx={{ 
                            color: '#e8eaed',
                            fontSize: '14px',
                            fontWeight: 500
                          }}>
                            {airport.name}
                          </Typography>
                        </Box>
                        <Typography sx={{ 
                          color: '#9aa0a6',
                          fontSize: '12px',
                          ml: 5.5
                        }}>
                          City in Turkey
                        </Typography>
                      </LocationItem>
                      <AirportItem onClick={() => {
                        setTo(airport);
                        setToQuery(`${airport.name} (${airport.code})`);
                        setShowToSuggestions(false);
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Box component="span" sx={{ mr: 1.5 }}>
                            <FlightLandIcon sx={{ color: '#9aa0a6', width: 16, height: 16 }} />
                          </Box>
                          <Box>
                            <Typography sx={{ 
                              color: '#e8eaed',
                              fontSize: '14px',
                              fontWeight: 500,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}>
                              {airport.name}
                              <Typography component="span" sx={{ 
                                color: '#9aa0a6',
                                fontSize: '12px',
                                fontWeight: 400
                              }}>
                                {airport.code}
                              </Typography>
                            </Typography>
                            <Typography sx={{ 
                              color: '#9aa0a6',
                              fontSize: '12px'
                            }}>
                              {airport.distance ? `${airport.distance} km to destination` : '30 km to destination'}
                            </Typography>
                          </Box>
                        </Box>
                      </AirportItem>
                    </React.Fragment>
                  ))}
                </AirportList>
              )}
            </Box>

            <Box sx={{ flex: 1.3 }}>
              <SearchField 
                onClick={(e) => {
                  setDatePickerAnchor(e.currentTarget);
                  setShowDatePicker(true);
                }}
                sx={{ cursor: 'pointer' }}
              >
                <CalendarTodayIcon sx={{ color: '#e8eaed', width: 20, height: 20, mr: 1.5 }} />
                <Box>
                  <Typography sx={{ color: '#e8eaed', fontSize: '15px', lineHeight: roundTrip ? '1.2' : '1.5' }}>
                    {departDate ? format(departDate, 'EEE, MMM d') : 'Departure'}
                  </Typography>
                  {roundTrip && (
                    <>
                      <Divider sx={{ my: 0.5, bgcolor: 'rgba(91, 93, 97, 0.7)' }} />
                      <Typography sx={{ color: '#e8eaed', fontSize: '15px', lineHeight: '1.2' }}>
                        {returnDate ? format(returnDate, 'EEE, MMM d') : 'Return'}
                      </Typography>
                    </>
                  )}
                </Box>
              </SearchField>
            </Box>
          </SearchFields>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <SearchButton
              startIcon={<SearchIcon sx={{ width: 20, height: 20 }} />}
              onClick={handleSearch}
            >
              Explore
            </SearchButton>
          </Box>

          <Menu
            anchorEl={tripTypeAnchor}
            open={Boolean(tripTypeAnchor)}
            onClose={() => setTripTypeAnchor(null)}
            PaperProps={{
              sx: {
                backgroundColor: '#363738',
                color: '#fff',
                '& .MuiMenuItem-root': {
                  '&:hover': {
                    backgroundColor: '#404040',
                  },
                },
              },
            }}
          >
            <MenuItem onClick={() => { setRoundTrip(true); setTripTypeAnchor(null); }}>
              Round trip
            </MenuItem>
            <MenuItem onClick={() => { setRoundTrip(false); setTripTypeAnchor(null); }}>
              One way
            </MenuItem>
          </Menu>

          <PassengerPopover
            open={Boolean(passengersAnchor)}
            anchorEl={passengersAnchor}
            onClose={() => setPassengersAnchor(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <PassengerTypeContainer>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>Adult</Typography>
                  <Typography sx={{ fontSize: '12px', color: '#8a8c8e' }}>Age 12 or above</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CounterButton
                    onClick={() => handlePassengerChange('adult', 'decrement')}
                    disabled={adults <= 1}
                  >
                    <RemoveIcon sx={{ fontSize: 20 }} />
                  </CounterButton>
                  <Typography sx={{ width: '20px', textAlign: 'center' }}>{adults}</Typography>
                  <CounterButton
                    onClick={() => handlePassengerChange('adult', 'increment')}
                    disabled={adults >= 9}
                  >
                    <AddIcon sx={{ fontSize: 20 }} />
                  </CounterButton>
                </Box>
              </Box>
            </PassengerTypeContainer>

            <PassengerTypeContainer>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>Child</Typography>
                  <Typography sx={{ fontSize: '12px', color: '#8a8c8e' }}>Age 2-11</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CounterButton
                    onClick={() => handlePassengerChange('child', 'decrement')}
                    disabled={children <= 0}
                  >
                    <RemoveIcon sx={{ fontSize: 20 }} />
                  </CounterButton>
                  <Typography sx={{ width: '20px', textAlign: 'center' }}>{children}</Typography>
                  <CounterButton
                    onClick={() => handlePassengerChange('child', 'increment')}
                    disabled={children >= 8}
                  >
                    <AddIcon sx={{ fontSize: 20 }} />
                  </CounterButton>
                </Box>
              </Box>
            </PassengerTypeContainer>

            <PassengerTypeContainer>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>Infant (with seat)</Typography>
                  <Typography sx={{ fontSize: '12px', color: '#8a8c8e' }}>Under 2 years</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CounterButton
                    onClick={() => handlePassengerChange('infant', 'decrement')}
                    disabled={infants <= 0}
                  >
                    <RemoveIcon sx={{ fontSize: 20 }} />
                  </CounterButton>
                  <Typography sx={{ width: '20px', textAlign: 'center' }}>{infants}</Typography>
                  <CounterButton
                    onClick={() => handlePassengerChange('infant', 'increment')}
                    disabled={infants >= 8}
                  >
                    <AddIcon sx={{ fontSize: 20 }} />
                  </CounterButton>
                </Box>
              </Box>
            </PassengerTypeContainer>

            <PassengerTypeContainer>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>Infant (on lap)</Typography>
                  <Typography sx={{ fontSize: '12px', color: '#8a8c8e' }}>Under 2 years</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CounterButton
                    onClick={() => handlePassengerChange('lapInfant', 'decrement')}
                    disabled={lapInfants <= 0}
                  >
                    <RemoveIcon sx={{ fontSize: 20 }} />
                  </CounterButton>
                  <Typography sx={{ width: '20px', textAlign: 'center' }}>{lapInfants}</Typography>
                  <CounterButton
                    onClick={() => handlePassengerChange('lapInfant', 'increment')}
                    disabled={lapInfants >= 8}
                  >
                    <AddIcon sx={{ fontSize: 20 }} />
                  </CounterButton>
                </Box>
              </Box>
            </PassengerTypeContainer>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderTop: '1px solid #5b5d61' }}>
              <Button
                sx={{ 
                  color: '#8ab4f8',
                  '&:hover': { backgroundColor: 'transparent' }
                }}
                onClick={() => setPassengersAnchor(null)}
              >
                Cancel
              </Button>
              <Button
                sx={{ 
                  color: '#8ab4f8',
                  '&:hover': { backgroundColor: 'transparent' }
                }}
                onClick={() => setPassengersAnchor(null)}
              >
                Done
              </Button>
            </Box>
          </PassengerPopover>

          <Menu
            anchorEl={cabinClassAnchor}
            open={Boolean(cabinClassAnchor)}
            onClose={() => setCabinClassAnchor(null)}
            PaperProps={{
              sx: {
                backgroundColor: '#363738',
                color: '#fff',
                '& .MuiMenuItem-root': {
                  '&:hover': {
                    backgroundColor: '#404040',
                  },
                },
              },
            }}
          >
            {['Economy', 'Premium Economy', 'Business', 'First'].map((cls) => (
              <MenuItem
                key={cls}
                onClick={() => {
                  setSelectedCabinClass(cls);
                  setCabinClass(cls as CabinClass);
                  setCabinClassAnchor(null);
                }}
              >
                {cls}
              </MenuItem>
            ))}
          </Menu>

          <Popover
            open={showDatePicker}
            anchorEl={datePickerAnchor}
            onClose={() => {
              setShowDatePicker(false);
              setDatePickerAnchor(null);
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            PaperProps={{
              sx: {
                backgroundColor: '#202124',
                borderRadius: 0,
                border: '1px solid #5b5d61',
              }
            }}
          >
            <CalendarContainer>
              <CalendarHeader>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ color: '#fff', fontSize: '16px', fontWeight: 500 }}>
                    {roundTrip ? 'Round trip' : 'One way'}
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: '#8ab4f8', 
                      fontSize: '14px',
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                    onClick={() => {
                      setDepartDate(null);
                      setReturnDate(null);
                    }}
                  >
                    Reset
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <NavigationButton onClick={handlePrevMonth}>
                    <NavigateBeforeIcon />
                  </NavigationButton>
                  <NavigationButton onClick={handleNextMonth}>
                    <NavigateNextIcon />
                  </NavigationButton>
                </Box>
              </CalendarHeader>

              <MonthContainer>
                {/* First Month */}
                <MonthGrid>
                  <Typography sx={{ color: '#fff', fontSize: '16px', mb: 2 }}>
                    {format(currentMonth, 'MMMM', { locale: tr })}
                  </Typography>
                  <WeekDayHeader>
                    {['P', 'S', 'Ç', 'P', 'C', 'C', 'P'].map((day, index) => (
                      <div key={index}>{day}</div>
                    ))}
                  </WeekDayHeader>
                  <DaysGrid>
                    {renderMonth(currentMonth)}
                  </DaysGrid>
                </MonthGrid>

                {/* Second Month */}
                <MonthGrid>
                  <Typography sx={{ color: '#fff', fontSize: '16px', mb: 2 }}>
                    {format(nextMonth, 'MMMM', { locale: tr })}
                  </Typography>
                  <WeekDayHeader>
                    {['P', 'S', 'Ç', 'P', 'C', 'C', 'P'].map((day, index) => (
                      <div key={index}>{day}</div>
                    ))}
                  </WeekDayHeader>
                  <DaysGrid>
                    {renderMonth(nextMonth)}
                  </DaysGrid>
                </MonthGrid>
              </MonthContainer>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  sx={{ 
                    color: '#8ab4f8',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: 'transparent' }
                  }}
                  onClick={() => setShowDatePicker(false)}
                >
                  Done
                </Button>
              </Box>
            </CalendarContainer>
          </Popover>
        </SearchBox>
      </SearchContainer>
    </>
  );
};

export default FlightSearch; 