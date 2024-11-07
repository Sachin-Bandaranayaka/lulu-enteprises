// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';
import { LanguageContext } from './LanguageContext';
import { AppContext } from './AppContext'; // Import AppContext

import InvoiceScreen from './screens/InvoiceScreen';
import StockScreen from './screens/StockScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [language, setLanguage] = useState('english');
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={{ isOffline }}>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Invoice') {
                  iconName = focused ? 'receipt' : 'receipt-outline';
                } else if (route.name === 'Stock') {
                  iconName = focused ? 'cube' : 'cube-outline';
                } else if (route.name === 'Expenses') {
                  iconName = focused ? 'cash' : 'cash-outline';
                } else if (route.name === 'Settings') {
                  iconName = focused ? 'settings' : 'settings-outline';
                }
                return <Icon name={iconName} size={size} color={color} />;
              },
            })}
          >
            <Tab.Screen name="Invoice" component={InvoiceScreen} />
            <Tab.Screen name="Stock" component={StockScreen} />
            <Tab.Screen name="Expenses" component={ExpensesScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </LanguageContext.Provider>
    </AppContext.Provider>
  );
}