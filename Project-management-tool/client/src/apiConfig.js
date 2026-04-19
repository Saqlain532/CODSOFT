const getApiUrl = () => {
  if (import.meta.env.PROD) {
    // In production, Vercel handles the routing. We use a relative path.
    return '/api';
  }
  // In development, we use the local server URL from the .env file.
  return import.meta.env.VITE_API_URL;
};

export const API_URL = getApiUrl();
