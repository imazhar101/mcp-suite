export interface DuffelConfig {
  apiKey: string;
  environment?: 'test' | 'live';
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  passengers: PassengerCount;
  cabin_class?: 'economy' | 'premium_economy' | 'business' | 'first';
  max_connections?: number;
}

export interface PassengerCount {
  adults: number;
  children?: number;
  infants?: number;
}

export interface OfferRequest {
  id: string;
  slices: Slice[];
  passengers: Passenger[];
  cabin_class?: string;
  max_connections?: number;
}

export interface Slice {
  origin: string;
  destination: string;
  departure_date: string;
}

export interface Passenger {
  type: 'adult' | 'child' | 'infant_without_seat';
  age?: number;
}

export interface Offer {
  id: string;
  expires_at: string;
  total_amount: string;
  total_currency: string;
  slices: OfferSlice[];
  passengers: OfferPassenger[];
  owner: Airline;
  payment_requirements?: PaymentRequirements;
}

export interface OfferSlice {
  id: string;
  segments: Segment[];
  duration: string;
  origin: Airport;
  destination: Airport;
  fare_brand_name?: string;
}

export interface Segment {
  id: string;
  origin: Airport;
  destination: Airport;
  departing_at: string;
  arriving_at: string;
  marketing_carrier: Airline;
  operating_carrier: Airline;
  aircraft?: Aircraft;
  duration: string;
  distance: string;
  marketing_carrier_flight_number: string;
  operating_carrier_flight_number: string;
}

export interface Airport {
  id: string;
  name: string;
  iata_code: string;
  icao_code: string;
  city_name: string;
  country_name: string;
  latitude?: number;
  longitude?: number;
}

export interface Airline {
  id: string;
  name: string;
  iata_code: string;
  icao_code: string;
}

export interface Aircraft {
  id: string;
  name: string;
  iata_type_code: string;
}

export interface OfferPassenger {
  id: string;
  type: string;
  age?: number;
  given_name?: string;
  family_name?: string;
  loyalty_programme_accounts?: LoyaltyProgrammeAccount[];
}

export interface LoyaltyProgrammeAccount {
  account_number: string;
  airline_iata_code: string;
}

export interface PaymentRequirements {
  requires_instant_payment: boolean;
  price_guarantee_expires_at?: string;
  payment_required_by?: string;
}

export interface OrderRequest {
  selected_offers: string[];
  passengers: OrderPassenger[];
  type: 'instant' | 'hold';
  payment?: PaymentRequest;
}

export interface OrderPassenger {
  id: string;
  type: 'adult' | 'child' | 'infant_without_seat';
  title?: string;
  given_name: string;
  family_name: string;
  gender?: 'M' | 'F';
  born_on?: string;
  email?: string;
  phone_number?: string;
  identity_documents?: IdentityDocument[];
  loyalty_programme_accounts?: LoyaltyProgrammeAccount[];
}

export interface IdentityDocument {
  type: 'passport' | 'tax_id' | 'known_traveler_number' | 'passenger_redress_number';
  unique_identifier: string;
  expires_on?: string;
  issued_on?: string;
  issuing_country_code?: string;
}

export interface PaymentRequest {
  type: 'balance' | 'card' | 'arc_bsp_cash';
  amount: string;
  currency: string;
  card?: CardPayment;
}

export interface CardPayment {
  number: string;
  expiry_month: string;
  expiry_year: string;
  cvc: string;
  name: string;
  address_line_1?: string;
  address_line_2?: string;
  address_city?: string;
  address_region?: string;
  address_postal_code?: string;
  address_country_code?: string;
}

export interface Order {
  id: string;
  booking_reference: string;
  owner: Airline;
  passengers: OrderPassenger[];
  slices: OrderSlice[];
  total_amount: string;
  total_currency: string;
  tax_amount?: string;
  tax_currency?: string;
  created_at: string;
  payment_status: PaymentStatus;
  documents?: Document[];
}

export interface OrderSlice {
  id: string;
  segments: OrderSegment[];
  origin: Airport;
  destination: Airport;
  duration: string;
  fare_brand_name?: string;
}

export interface OrderSegment {
  id: string;
  origin: Airport;
  destination: Airport;
  departing_at: string;
  arriving_at: string;
  marketing_carrier: Airline;
  operating_carrier: Airline;
  aircraft?: Aircraft;
  duration: string;
  distance: string;
  marketing_carrier_flight_number: string;
  operating_carrier_flight_number: string;
  passengers: SegmentPassenger[];
}

export interface SegmentPassenger {
  passenger_id: string;
  cabin_class: string;
  cabin_class_marketing_name?: string;
  fare_basis_code?: string;
  seat?: Seat;
}

export interface Seat {
  designator: string;
  name?: string;
  disclosures?: string[];
  element_type?: string;
}

export interface PaymentStatus {
  awaiting_payment: boolean;
  payment_required_by?: string;
  price_guarantee_expires_at?: string;
}

export interface Document {
  type: 'electronic_ticket' | 'electronic_miscellaneous_document';
  unique_identifier: string;
  passenger_id: string;
}