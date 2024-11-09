// config.js
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (__DEV__) {
    // For development
    if (Platform.OS === 'android') {
      return 'http://192.168.8.101:3000'; // Your computer's IP address
    } else if (Platform.OS === 'ios') {
      return 'http://172.20.10.3:3000';
    }
    return 'http://localhost:8081';
  }
  // Production URL
  return 'https://your-production-url.com';
};

const BASE_URL = getBaseUrl();

// API endpoints
export const PRODUCTS_API = `${BASE_URL}/api/products`;
export const INVOICES_API = `${BASE_URL}/api/invoices`;
export const EXPENSES_API = `${BASE_URL}/api/expenses`;
export const DISCOUNT_RULES_API = `${BASE_URL}/api/discountRules`;

export default BASE_URL;


// // config.js
// import Constants from 'expo-constants';
// import { Platform } from 'react-native';

// const getBaseUrl = () => {
//   if (__DEV__) {
//     // For development
//     if (Platform.OS === 'android') {
//       return 'http://192.168.8.101:3000'; // Your computer's IP address
//     } else if (Platform.OS === 'ios') {
//       return 'http://localhost:3000';
//     }
//     return 'http://localhost:3000';
//   }
//   // Production URL
//   return 'https://your-production-url.com';
// };

// const BASE_URL = getBaseUrl();

// // API endpoints
// export const PRODUCTS_API = `${BASE_URL}/api/products`;
// export const INVOICES_API = `${BASE_URL}/api/invoices`;
// export const EXPENSES_API = `${BASE_URL}/api/expenses`;
// export const DISCOUNT_RULES_API = `${BASE_URL}/api/discountRules`;

// export default BASE_URL;