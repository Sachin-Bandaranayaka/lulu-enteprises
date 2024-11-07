// screens/StockScreen.js
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
import { PRODUCTS_API } from '../config';

function StockScreen() {
  const { language } = useContext(LanguageContext);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    name_si: '',
    price: '',
    stock: ''
  });

  useEffect(() => {
    fetchProducts();
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

  const addProduct = async () => {
    if (newProduct.name && newProduct.name_si && newProduct.price && newProduct.stock) {
      try {
        const response = await axios.post(PRODUCTS_API, {
          name: newProduct.name,
          name_si: newProduct.name_si,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock)
        });

        setProducts([...products, response.data]);
        setNewProduct({ name: '', name_si: '', price: '', stock: '' });
      } catch (error) {
        console.error('Error adding product:', error);
        Alert.alert(
          language === 'english' ? 'Error' : 'දෝෂයකි',
          language === 'english' ? 'Failed to add product' : 'භාණ්ඩය එකතු කිරීමට අපොහොසත් විය'
        );
      }
    } else {
      Alert.alert(
        language === 'english' ? 'Alert' : 'අවවාදයයි',
        language === 'english' ? 'Please fill out all fields.' : 'කරුණාකර සියලු ක්ෂේත්‍රීයන් සපුරා තියන්න.'
      );
    }
  };

  const updateStock = async (id, newStock) => {
    try {
      const response = await axios.put(`${PRODUCTS_API}/${id}`, { stock: parseInt(newStock, 10) || 0 });
      setProducts(products.map(product => 
        product.id === id ? response.data : product
      ));
    } catch (error) {
      console.error('Error updating stock:', error);
      Alert.alert(
        language === 'english' ? 'Error' : 'දෝෂයකි',
        language === 'english' ? 'Failed to update stock' : 'තොගය යාවත්කාලීන කිරීමට අපොහොසත් විය'
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

export default StockScreen;