import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { BASE_URL } from '../config';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async config => {
    // Check internet connection
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      throw new Error('No internet connection');
    }

    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  response => {
    console.log(`Received response from ${response.config.url}:`, response.status);
    return response;
  },
  error => {
    if (error.message === 'No internet connection') {
      console.error('Network Error: No internet connection');
    } else if (error.code === 'ECONNABORTED') {
      console.error('Network Error: Request timeout');
    } else if (error.response) {
      console.error('Server error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network error - no response received');
    } else {
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;