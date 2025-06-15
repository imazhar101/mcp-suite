export interface McpServerConfig {
  name: string;
  version: string;
  description?: string;
  author?: string;
  license?: string;
}

export interface ApiCredentials {
  apiKey?: string;
  token?: string;
  username?: string;
  password?: string;
  baseUrl?: string;
}

export interface ServerResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SearchOptions extends PaginationOptions {
  query?: string;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  server: string;
  action: string;
  userId?: string;
  timestamp: string;
}