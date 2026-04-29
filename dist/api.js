import axios from 'axios';
import * as https from 'https';
import { readCredentials, saveCredentials, clearCredentials } from './credentials.js';
const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});
// Create axios instance with common configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';
export const api = axios.create({
    baseURL: BACKEND_URL,
    httpsAgent: httpsAgent,
    headers: {
        'X-API-Version': '1'
    }
});
api.interceptors.request.use(config => {
    const credentials = readCredentials();
    if (credentials) {
        config.headers.Authorization = `Bearer ${credentials.access_token}`;
    }
    return config;
});
api.interceptors.response.use(response => response, async (error) => {
    if (error.response?.status === 401) {
        const credentials = readCredentials();
        if (credentials && credentials.refresh_token) {
            try {
                const refreshResponse = await api.post('/auth/refresh', {
                    refresh_token: credentials.refresh_token
                });
                if (refreshResponse.data.access_token &&
                    refreshResponse.data.refresh_token) {
                    saveCredentials({
                        ...credentials,
                        access_token: refreshResponse.data.access_token,
                        refresh_token: refreshResponse.data.refresh_token
                    });
                    const originalRequest = error.config;
                    if (originalRequest) {
                        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`;
                        return api.request(originalRequest);
                    }
                }
                else {
                    clearCredentials();
                    process.exit(1);
                }
            }
            catch (refreshError) {
                clearCredentials();
                process.exit(1);
            }
        }
        else {
            clearCredentials();
        }
    }
    return Promise.reject(error);
});
export default api;
