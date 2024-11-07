// config.js

import Constants from 'expo-constants';

let BASE_URL = '';

if (Constants.manifest && Constants.manifest.debuggerHost) {
  // Extract the IP address of the development machine dynamically
  const { debuggerHost } = Constants.manifest;
  const ipAddress = debuggerHost.split(':').shift();
  BASE_URL = `http://${ipAddress}:3000`; // Adjust the port if your backend uses a different one
} else {
  // Fallback for production or if manifest is not available
  BASE_URL = 'exp://192.168.8.101:8081'; // Replace with your production API URL
}

export const PRODUCTS_API = `${BASE_URL}/api/products`;
export const INVOICES_API = `${BASE_URL}/api/invoices`;
export const EXPENSES_API = `${BASE_URL}/api/expenses`;
export const DISCOUNT_RULES_API = `${BASE_URL}/api/discountRules`;