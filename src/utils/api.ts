import { projectId, publicAnonKey } from './supabase/info';

export const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-8ab7634a`;

/**
 * Helper to construct full API URL
 */
export const getApiUrl = (endpoint: string) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${cleanEndpoint}`;
};

/**
 * Common headers for API requests
 */
export const getHeaders = (accessToken?: string) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }
  
  return headers;
};
