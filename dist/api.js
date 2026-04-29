import axios from 'axios';
import * as https from 'https';
import { readCredentials } from './credentials.js';
// Create an HTTPS agent that ignores SSL certificate errors (for development)
const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});
// Create axios instance with common configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
export const api = axios.create({
    baseURL: BACKEND_URL,
    httpsAgent: httpsAgent,
    headers: {
        'X-API-Version': '1'
    }
});
// Add request interceptor to add authentication headers
api.interceptors.request.use((config) => {
    // Add Authorization header if credentials exist
    const credentials = readCredentials();
    if (credentials) {
        config.headers.Authorization = `Bearer ${credentials.access_token}`;
    }
    return config;
});
// Add response interceptor for token refresh
api.interceptors.response.use(response => response, async (error) => {
    if (error.response?.status === 401) {
        // Handle 401 errors with token refresh
        // Implementation would go here
    }
    return Promise.reject(error);
});
export default api;
