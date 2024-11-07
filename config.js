// config.js
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (__DEV__) {
    // For development on Expo Go
    if (Platform.OS === 'android') {
      // Android development
      return 'exp://192.168.8.101:8081'; // Android emulator localhost
    } else if (Platform.OS === 'ios') {
      // iOS development
      return 'http://localhost:3000'; // iOS simulator localhost
    } else {
      // Web development
      return 'http://localhost:3000';
    }
  }
  // Production URL
  return 'https://your-production-url.com'; // Replace with your actual production URL
};

const BASE_URL = getBaseUrl();

// API endpoints
export const PRODUCTS_API = `${BASE_URL}/api/products`;
export const INVOICES_API = `${BASE_URL}/api/invoices`;
export const EXPENSES_API = `${BASE_URL}/api/expenses`;
export const DISCOUNT_RULES_API = `${BASE_URL}/api/discountRules`;

export default BASE_URL;