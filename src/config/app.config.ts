export const APP_CONFIG = {
  name: 'SiteTracker Spark',
  version: '1.0.0',
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    timeout: 10000,
  },
  auth: {
    tokenKey: 'st_auth_token',
    refreshTokenKey: 'st_refresh_token',
    tokenExpiry: 60 * 60 * 1000, // 1 hour
  },
  salesforce: {
    clientId: import.meta.env.VITE_SALESFORCE_CLIENT_ID,
    redirectUri: import.meta.env.VITE_SALESFORCE_REDIRECT_URI,
  },
} as const

export type AppConfig = typeof APP_CONFIG
