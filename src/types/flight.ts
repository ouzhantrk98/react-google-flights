export interface Flight {
  id: string;
  departure: {
    airport: string;
    time: string;
    terminal?: string;
    gate?: string;
    city: string;
  };
  arrival: {
    airport: string;
    time: string;
    terminal?: string;
    gate?: string;
    city: string;
  };
  airline: string;
  flightNumber: string;
  price: number;
  duration: string;
  stops: number;
  stopDetails?: {
    airport: string;
    duration: string;
  }[];
  aircraft?: string;
  cabinClass: string;
  seatsAvailable?: number;
  baggage?: {
    carryOn: boolean;
    checkedBags: number;
  };
  refundable?: boolean;
  eco?: {
    emissions: string;
    comparison?: string;
  };
}

export interface SearchParams {
  from: string;
  to: string;
  date: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  cabinClass: CabinClass;
  currency: string;
  maxStops?: number;
  airlines?: string[];
  alliance?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

export enum CabinClass {
  ECONOMY = 'ECONOMY',
  PREMIUM_ECONOMY = 'PREMIUM_ECONOMY',
  BUSINESS = 'BUSINESS',
  FIRST = 'FIRST'
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  type?: string;
  distance?: string;
  timezone?: string;
}

export interface AirportSearchResult {
  code: string;
  name: string;
  city: string;
  country: string;
  type: string;
  distance?: string;
  entityId: string;
} 