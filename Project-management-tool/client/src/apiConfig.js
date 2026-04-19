const getApiUrl = () => {
  if (import.meta.env.PROD) {
    // Production: deployed server on Render
    return 'https://codsoft-6ss2.onrender.com/api';
  }
  // In development, use local server URL from .env file.
  return import.meta.env.VITE_API_URL;
};

export const API_URL = getApiUrl();
