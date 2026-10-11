/**
 * VisionX API Configuration Helper
 * Automatically handles local development (proxied relative URLs)
 * and production deployment on Render/Vercel (via VITE_API_URL).
 */

const RAW_API_URL = (import.meta.env.VITE_API_URL as string | undefined) || '';

// Clean base URL to remove any trailing slashes
export const API_BASE_URL = RAW_API_URL.replace(/\/+$/, '');

export const getApiUrl = (endpoint: string): string => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!API_BASE_URL) {
    return path;
  }
  // Ensure protocol is included if missing
  const fullBase = API_BASE_URL.startsWith('http') ? API_BASE_URL : `https://${API_BASE_URL}`;
  return `${fullBase}${path}`;
};
