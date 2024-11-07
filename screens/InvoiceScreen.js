// screens/InvoiceScreen.js
import React, { useState, useContext, useEffect } from 'react';
import { 
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import { LanguageContext } from '../LanguageContext';
import { AppContext } from '../AppContext';
import ProductItem from '../components/ProductItem';
import { PRODUCTS_API, INVOICES_API, DISCOUNT_RULES_API } from '../config';

function InvoiceScreen() {
  const { language } = useContext(LanguageContext);
  const { isOffline } = useContext(AppContext);

  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({ storeName: '', contactNumber: '' });
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [discountRules, setDiscountRules] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchDiscountRules();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(PRODUCTS_API);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert(
        language === 'english' ? 'Error' : 'දෝෂයකි',
        language === 'english' ? 'Failed to load products' : 'භාණ්ඩ පූරණය කිරීමට අපොහොසත් විය'
      );
    }
  };

  const fetchDiscountRules = async () => {
    try {
      const response = await axios.get(DISCOUNT_RULES_API);
      setDiscountRules(response.data);
    } catch (error) {
      console.error('Error fetching discount rules:', error);
      Alert.alert(
        language === 'english' ? 'Error' : 'දෝෂයකි',
        language === 'english' ? 'Failed to load discount rules' : 'වට්ටම් නීති පූරණය කිරීමට අපොහොසත් විය'
      );
    }
  };

  const updateItemQuantity = (productId, quantity) => {
    const product = products.find(p => p.id === productId);
    if (!product || quantity > product.stock) return;

    const newItems = [...selectedItems];
    const existingItem = newItems.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity = quantity;
      existingItem.total = quantity * existingItem.price;
    } else if (quantity > 0) {
      newItems.push({
        id: product.id,
        name: product.name,
        name_si: product.name_si,
        price: product.price,
        quantity: quantity,
        total: product.price * quantity
      });
    }
    
    setSelectedItems(newItems.filter(item => item.quantity > 0));
    calculateTotals(newItems);
  };

  const calculateTotals = (items) => {
    const itemsTotal = items.reduce((acc, item) => acc + item.total, 0);
    setSubtotal(itemsTotal);
    let applicableDiscount = 0;

    // Apply discount rules
    discountRules.forEach((rule) => {
      if (itemsTotal >= parseFloat(rule.minAmount)) {
        applicableDiscount = (itemsTotal * parseFloat(rule.percentage)) / 100;
      }
    });

    setDiscount(applicableDiscount);
    setTotal(itemsTotal - applicableDiscount);
  };

  const saveInvoice = async () => {
    if (selectedItems.length === 0) {
      Alert.alert(
        language === 'english' ? 'Alert' : 'අවවාදයයි',
        language === 'english' ? 'Please select at least one product.' : 'කරුණාකරවත් එක් භාණ්ඩයක් තෝරන්න.'
      );
      return;
    }

    if (isOffline) {
      Alert.alert(
        language === 'english' ? 'Offline' : 'අන්තර්ජාල සම්බන්ධතාව නොමැත',
        language === 'english' ? 'Cannot save invoice while offline.' : 'අන්තර්ජාල සම්බන්ධතාව නොමැතිව ඉන්වොයිසිය සුරැකීමට නොහැක.'
      );
      return;
    }

    const invoiceData = {
      customerDetails: {
        storeName: customerDetails.storeName,
        contactNumber: customerDetails.contactNumber,
      },
      items: selectedItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
      subtotal,
      discount,
      total,
    };

    try {
      await axios.post(INVOICES_API, invoiceData);

      // Reset state
      setSelectedItems([]);
      setCustomerDetails({ storeName: '', contactNumber: '' });
      setSubtotal(0);
      setDiscount(0);
      setTotal(0);

      Alert.alert(
        language === 'english' ? 'Success' : 'සාර්ථකයි',
        language === 'english' ? 'Invoice saved successfully' : 'ඉන්වොයිසිය සාර්ථකව සුරකින ලදී'
      );

      // Refresh products to update stock levels
      fetchProducts();
    } catch (error) {
      console.error('Error saving invoice:', error);
      Alert.alert(
        language === 'english' ? 'Error' : 'දෝෂයකි',
        language === 'english' ? 'Error saving invoice' : 'ඉන්වොයිසිය සුරැකීමේ දෝෂයකි'
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* ... Rest of your component */}
    </View>
  );
}

const styles = StyleSheet.create({
  // Your styles here
});

export default InvoiceScreen;