// screens/StockScreen.js
import { BASE_URL, PRODUCTS_API, INVOICES_API, EXPENSES_API, DISCOUNT_RULES_API } from '../config';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/expenses`); // Replace with your server URL
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
        const response = await axios.post(`${BASE_URL}/api/products`, {
          name: newProduct.name,
          name_si: newProduct.name_si,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock)
        }); // Replace with your server URL

        setProducts([...products, response.data]);
        setNewProduct({ name: '', name_si: '', price: '', stock: '' });
      } catch (error) {
        console.error('Error adding product:', error);
        Alert.alert(
          language === 'english' ? 'Error' : 'දෝෂයකි',
          language === 'english' ? 'Failed to add product' : 'භාණ්ඩය එකතු කිරීමට අපොහොසත් විය'
        );
      }
    }
  };

  const updateStock = async (id, newStock) => {
    try {
      await axios.put(`${BASE_URL}/api/products/${id}`, { stock: parseInt(newStock, 10) || 0 }); // Replace with your server URL
      setProducts(products.map(product => 
        product.id === id ? { ...product, stock: parseInt(newStock, 10) || 0 } : product
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
      <View style={styles.addProductSection}>
        <Text style={styles.sectionTitle}>
          {language === 'english' ? 'Add New Product' : 'නව භාණ්ඩයක් එකතු කරන්න'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={language === 'english' ? "Product Name (English)" : "භාණ්ඩයේ නම (ඉංග්‍රීසි)"}
          value={newProduct.name}
          onChangeText={(text) => setNewProduct(prev => ({ ...prev, name: text }))}
        />
        <TextInput
          style={styles.input}
          placeholder={language === 'english' ? "Product Name (Sinhala)" : "භාණ්ඩයේ නම (සිංහල)"}
          value={newProduct.name_si}
          onChangeText={(text) => setNewProduct(prev => ({ ...prev, name_si: text }))}
        />
        <TextInput
          style={styles.input}
          placeholder={language === 'english' ? "Price (LKR)" : "මිල (රු.)"}
          value={newProduct.price}
          onChangeText={(text) => setNewProduct(prev => ({ ...prev, price: text }))}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder={language === 'english' ? "Initial Stock" : "ආරම්භක තොගය"}
          value={newProduct.stock}
          onChangeText={(text) => setNewProduct(prev => ({ ...prev, stock: text }))}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={addProduct}>
          <Text style={styles.buttonText}>
            {language === 'english' ? 'Add Product' : 'භාණ්ඩය එකතු කරන්න'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>
                {language === 'english' ? item.name : item.name_si}
              </Text>
              <Text>LKR {item.price.toLocaleString()}</Text>
            </View>
            <View style={styles.stockControl}>
              <Text>{language === 'english' ? 'Stock:' : 'තොගය:'}</Text>
              <TextInput
                style={styles.stockInput}
                value={item.stock.toString()}
                onChangeText={(text) => updateStock(item.id, text)}
                keyboardType="numeric"
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // ... [Same styles as before]
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  addProductSection: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productInfo: {
    flex: 2,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  stockControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 5,
    width: 60,
    textAlign: 'center',
    borderRadius: 5,
    marginLeft: 5,
  },
});

export default StockScreen;