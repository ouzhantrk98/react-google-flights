import axios from 'axios';
import { SearchParams, AirportSearchResult } from '../types/flight';

const API_KEY = process.env.REACT_APP_RAPID_API_KEY;
const BASE_URL = 'https://sky-scrapper.p.rapidapi.com/api';

const headers = {
  'X-RapidAPI-Key': API_KEY,
  'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com'
};

export const searchFlights = async (params: SearchParams) => {
  try {
    console.log('Starting flight search with parameters:', params);

    // First get the entityId for both airports
    const fromAirport = await getAirports(params.from);
    const toAirport = await getAirports(params.to);

    console.log('Airport lookup results:', { fromAirport, toAirport });

    if (!fromAirport.length || !toAirport.length) {
      console.error('Airport lookup failed:', {
        fromAirport: fromAirport.length ? 'found' : 'not found',
        toAirport: toAirport.length ? 'found' : 'not found'
      });
      return [];
    }

    // Get the correct IDs from the airport data
    const originSkyId = fromAirport[0].code;
    const destinationSkyId = toAirport[0].code;
    const originEntityId = fromAirport[0].entityId;
    const destinationEntityId = toAirport[0].entityId;

    console.log('Using IDs for API call:', {
      originSkyId,
      destinationSkyId,
      originEntityId,
      destinationEntityId
    });

    const response = await axios.get(`${BASE_URL}/v1/flights/searchFlights`, {
      params: {
        originSkyId,
        destinationSkyId,
        originEntityId,
        destinationEntityId,
        date: params.date,
        adults: params.adults || 1,
        cabinClass: params.cabinClass.toLowerCase(),
        market: 'en-US',
        currency: params.currency,
        ...(params.returnDate && { returnDate: params.returnDate }),
        ...(params.children && { children: params.children }),
        ...(params.infants && { infants: params.infants })
      },
      headers
    });

    console.log('Raw API Response:', response.data);

    if (!response.data?.data?.itineraries || !Array.isArray(response.data.data.itineraries)) {
      console.error('Invalid API response structure:', response.data);
      return [];
    }

    // Transform the API response to match our Flight interface
    const flights = response.data.data.itineraries.flatMap((itinerary: any) => {
      try {
        if (!itinerary || !itinerary.legs) return [];
        
        // Get the price from the itinerary
        const price = itinerary.price?.raw || itinerary.price?.amount || 0;
        
        return itinerary.legs.map((leg: any) => ({
          id: `${leg.id || Math.random().toString(36).substr(2, 9)}`,
          departure: {
            airport: leg.origin?.name || '',
            time: new Date(leg.departure).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }),
            terminal: leg.originTerminal,
            city: leg.origin?.city || leg.origin?.name?.split(' ')[0] || ''
          },
          arrival: {
            airport: leg.destination?.name || '',
            time: new Date(leg.arrival).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }),
            terminal: leg.destinationTerminal,
            city: leg.destination?.city || leg.destination?.name?.split(' ')[0] || ''
          },
          airline: leg.marketingCarrier?.name || leg.operatingCarrier?.name || '',
          flightNumber: `${leg.marketingCarrier?.code || ''}${leg.marketingCarrier?.flightNumber || ''}`,
          price: Number(price),
          duration: leg.durationInMinutes ? `${Math.floor(leg.durationInMinutes / 60)}h ${leg.durationInMinutes % 60}m` : '',
          stops: leg.stopCount || 0,
          stopDetails: leg.stops?.map((stop: any) => ({
            airport: stop.airport?.name || '',
            duration: stop.durationInMinutes ? `${Math.floor(stop.durationInMinutes / 60)}h ${stop.durationInMinutes % 60}m` : ''
          })) || [],
          aircraft: leg.equipment?.name,
          cabinClass: leg.cabinClass || params.cabinClass,
          seatsAvailable: leg.seatsAvailable,
          baggage: {
            carryOn: leg.baggage?.cabinBag || false,
            checkedBags: leg.baggage?.checkedBag || 0
          },
          refundable: itinerary.isRefundable || false,
          eco: leg.sustainability ? {
            emissions: `${leg.sustainability.co2?.amount || ''} ${leg.sustainability.co2?.unit || ''}`,
            comparison: leg.sustainability.co2?.comparison
          } : undefined
        }));
      } catch (error) {
        console.error('Error processing flight leg:', error);
        return [];
      }
    });

    console.log('Processed Flights:', flights);
    return flights;

  } catch (error: any) {
    console.error('Error fetching flights:', {
      message: error.message,
      response: error.response?.data
    });
    return [];
  }
};

export const getAirports = async (query: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/v1/flights/searchAirport`, {
      params: { 
        query,
        limit: 10
      },
      headers
    });
    
    // Handle the Sky Scrapper API response format
    if (response.data?.status && response.data?.data) {
      return response.data.data.map((airport: any) => ({
        code: airport.skyId,
        name: airport.presentation.suggestionTitle || airport.presentation.title,
        city: airport.navigation.localizedName,
        country: airport.presentation.subtitle,
        type: airport.navigation.entityType,
        distance: airport.navigation.relevantFlightParams?.distance,
        entityId: airport.navigation.entityId
      } as AirportSearchResult)).filter((airport: AirportSearchResult) => airport.code && airport.name);
    }
    return [];
  } catch (error) {
    console.error('Error fetching airports:', error);
    return [];
  }
};

// Get airline list
export const getAirlines = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/airlines`, {
      headers
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching airlines:', error);
    return [];
  }
};

// Get flight prices history
export const getPriceHistory = async (params: SearchParams) => {
  try {
    const response = await axios.get(`${BASE_URL}/prices/history`, {
      params: {
        from: params.from,
        to: params.to,
        date: params.date
      },
      headers
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching price history:', error);
    return null;
  }
}; 