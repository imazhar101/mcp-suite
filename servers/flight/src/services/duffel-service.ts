import axios, { AxiosInstance } from 'axios';
import { Logger } from '../../../../shared/utils/logger.js';
import {
  DuffelConfig,
  FlightSearchParams,
  OfferRequest,
  Offer,
  Order,
  OrderRequest,
  Passenger,
  Slice,
} from '../types/index.js';

export class DuffelService {
  private client: AxiosInstance;
  private logger: Logger;

  constructor(config: DuffelConfig, logger: Logger) {
    this.logger = logger;
    
    const baseURL = config.environment === 'live' 
      ? 'https://api.duffel.com'
      : 'https://api.duffel.com';

    this.client = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'Duffel-Version': 'v2',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        this.logger.debug('Making request to Duffel API', {
          method: config.method,
          url: config.url,
          data: config.data,
        });
        return config;
      },
      (error) => {
        this.logger.error('Request interceptor error', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        this.logger.debug('Received response from Duffel API', {
          status: response.status,
          url: response.config.url,
        });
        return response;
      },
      (error) => {
        this.logger.error('Response interceptor error', {
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
        return Promise.reject(error);
      }
    );
  }

  async testConnection(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await this.client.get('/air/airlines');
      return {
        success: true,
        message: 'Successfully connected to Duffel API',
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Connection failed: ${error.message}`,
      };
    }
  }

  async searchFlights(params: FlightSearchParams): Promise<{ success: boolean; data?: OfferRequest; error?: string }> {
    try {
      const slices: Slice[] = [
        {
          origin: params.origin,
          destination: params.destination,
          departure_date: params.departure_date,
        },
      ];

      if (params.return_date) {
        slices.push({
          origin: params.destination,
          destination: params.origin,
          departure_date: params.return_date,
        });
      }

      const passengers: Passenger[] = [];
      for (let i = 0; i < params.passengers.adults; i++) {
        passengers.push({ type: 'adult' });
      }
      if (params.passengers.children) {
        for (let i = 0; i < params.passengers.children; i++) {
          passengers.push({ type: 'child' });
        }
      }
      if (params.passengers.infants) {
        for (let i = 0; i < params.passengers.infants; i++) {
          passengers.push({ type: 'infant_without_seat' });
        }
      }

      const requestData = {
        data: {
          slices,
          passengers,
          cabin_class: params.cabin_class || 'economy',
          max_connections: params.max_connections,
        },
      };

      const response = await this.client.post('/air/offer_requests', requestData);
      
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Flight search failed: ${error.response?.data?.errors?.[0]?.detail || error.message}`,
      };
    }
  }

  async getOfferRequest(offerRequestId: string): Promise<{ success: boolean; data?: OfferRequest; error?: string }> {
    try {
      const response = await this.client.get(`/air/offer_requests/${offerRequestId}`);
      
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Failed to get offer request: ${error.response?.data?.errors?.[0]?.detail || error.message}`,
      };
    }
  }

  async getOffers(offerRequestId: string, limit?: number): Promise<{ success: boolean; data?: Offer[]; error?: string }> {
    try {
      const params = new URLSearchParams({
        offer_request_id: offerRequestId,
      });
      
      if (limit) {
        params.append('limit', limit.toString());
      }

      const response = await this.client.get(`/air/offers?${params}`);
      
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Failed to get offers: ${error.response?.data?.errors?.[0]?.detail || error.message}`,
      };
    }
  }

  async getOffer(offerId: string): Promise<{ success: boolean; data?: Offer; error?: string }> {
    try {
      const response = await this.client.get(`/air/offers/${offerId}`);
      
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Failed to get offer: ${error.response?.data?.errors?.[0]?.detail || error.message}`,
      };
    }
  }

  async createOrder(orderRequest: OrderRequest): Promise<{ success: boolean; data?: Order; error?: string }> {
    try {
      const response = await this.client.post('/air/orders', {
        data: orderRequest,
      });
      
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Failed to create order: ${error.response?.data?.errors?.[0]?.detail || error.message}`,
      };
    }
  }

  async getOrder(orderId: string): Promise<{ success: boolean; data?: Order; error?: string }> {
    try {
      const response = await this.client.get(`/air/orders/${orderId}`);
      
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Failed to get order: ${error.response?.data?.errors?.[0]?.detail || error.message}`,
      };
    }
  }

  async listOrders(limit?: number, after?: string): Promise<{ success: boolean; data?: Order[]; error?: string }> {
    try {
      const params = new URLSearchParams();
      
      if (limit) {
        params.append('limit', limit.toString());
      }
      if (after) {
        params.append('after', after);
      }

      const response = await this.client.get(`/air/orders?${params}`);
      
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Failed to list orders: ${error.response?.data?.errors?.[0]?.detail || error.message}`,
      };
    }
  }

  async cancelOrder(orderId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      await this.client.post(`/air/orders/${orderId}/actions/cancel`);
      
      return {
        success: true,
        message: 'Order cancelled successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Failed to cancel order: ${error.response?.data?.errors?.[0]?.detail || error.message}`,
      };
    }
  }

  async getSeatMaps(offerId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await this.client.get(`/air/seat_maps?offer_id=${offerId}`);
      
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Failed to get seat maps: ${error.response?.data?.errors?.[0]?.detail || error.message}`,
      };
    }
  }

  async getAirlines(limit?: number): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
      const params = new URLSearchParams();
      if (limit) {
        params.append('limit', limit.toString());
      }

      const response = await this.client.get(`/air/airlines?${params}`);
      
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Failed to get airlines: ${error.response?.data?.errors?.[0]?.detail || error.message}`,
      };
    }
  }

  async getAirports(limit?: number, iataCode?: string, iataCountryCode?: string, after?: string, before?: string): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
      const params = new URLSearchParams();
      if (limit) {
        params.append('limit', limit.toString());
      }
      if (iataCode) {
        params.append('iata_code', iataCode);
      }
      if (iataCountryCode) {
        params.append('iata_country_code', iataCountryCode);
      }
      if (after) {
        params.append('after', after);
      }
      if (before) {
        params.append('before', before);
      }

      const response = await this.client.get(`/air/airports?${params}`);
      
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Failed to get airports: ${error.response?.data?.errors?.[0]?.detail || error.message}`,
      };
    }
  }
}