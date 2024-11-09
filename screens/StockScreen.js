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
import { SafeAreaView } from 'react-native-safe-area-context';

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
  }, [products]);

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
    if (!newProduct.name || !newProduct.name_si || !newProduct.price || !newProduct.stock) {
      Alert.alert(
        language === 'english' ? 'Missing Information' : 'තොරතුරු අඩුයි',
        language === 'english' ? 'Please fill all fields' : 'සියලුම තොරතුරු පුරවන්න'
      );
      return;
    }

    try {
      const response = await axios.post(PRODUCTS_API, {
        name: newProduct.name,
        name_si: newProduct.name_si,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock)
      });

      setProducts([...products, response.data]);
      setNewProduct({ name: '', name_si: '', price: '', stock: '' });
      
      Alert.alert(
        language === 'english' ? 'Success' : 'සාර්ථකයි',
        language === 'english' ? 'Product added successfully' : 'භාණ්ඩය සාර්ථකව එකතු කරන ලදී'
      );
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert(
        language === 'english' ? 'Error' : 'දෝෂයකි',
        language === 'english' ? 'Failed to add product' : 'භාණ්ඩය එකතු කිරීමට අපොහොසත් විය'
      );
    }
  };

  const updateStock = async (id, newStock) => {
    try {
      const response = await axios.put(`${PRODUCTS_API}/${id}`, {
        stock: parseInt(newStock) || 0
      });
      
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


  const handleDelete = async (id) => {
    console.log("Attempting to delete product with ID:", id);
    Alert.alert(
      language === 'english' ? 'Delete Product' : 'භාණ්ඩය ඉවත් කරන්න',
      language === 'english' ? 'Are you sure you want to delete this product?' : 'ඔබට මෙම භාණ්ඩය ඉවත් කිරීමට අවශ්ය බවට ඔබ විශ්වාසද?',
      [
        {
          text: language === 'english' ? 'Cancel' : 'අවලංගු කරන්න',
          style: 'cancel',
        },
        {
          text: language === 'english' ? 'Delete' : 'ඉවත් කරන්න',
          onPress: async () => {
            try {
              await axios.delete(`${PRODUCTS_API}/${id}`);
              setProducts(products.filter((product) => product.id !== id));
              Alert.alert(
                language === 'english' ? 'Deleted' : 'ඉවත් කරන ලදී',
                language === 'english' ? 'Product deleted successfully' : 'භාණ්ඩය සාර්ථකව ඉවත් කරන ලදී'
              );
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert(
                language === 'english' ? 'Error' : 'දෝෂයකි',
                language === 'english' ? 'Failed to delete product' : 'භාණ්ඩය ඉවත් කිරීමට අපොහොසත් විය'
              );
            }
          },
        },
      ]
    );
  };

  // screens/StockScreen.js
// ... (keep the existing imports and logic)

return (
  <SafeAreaView style={{height:"100%",padding:15, backgroundColor:"#FFF"}} > 
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
      <TouchableOpacity style={styles.addButton} onPress={addProduct}>
        <Text style={styles.buttonText}>
          {language === 'english' ? 'Add Product' : 'භාණ්ඩය එකතු කරන්න'}
        </Text>
      </TouchableOpacity>
    </View>

    <View style={styles.productList}>
      <Text style={styles.sectionTitle}>
        {language === 'english' ? 'Current Stock' : 'වත්මන් තොගය'}
      </Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>
                {language === 'english' ? item.name : item.name_si}
              </Text>
              <Text style={styles.productPrice}>
                LKR {item.price.toLocaleString()}
              </Text>
            </View>
            <View style={styles.stockControl}>
              <Text style={styles.stockLabel}>
                {language === 'english' ? 'Stock:' : 'තොගය:'}
              </Text>
              <TextInput
                style={styles.stockInput}
                value={item.stock.toString()}
                onChangeText={(text) => updateStock(item.id, text)}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.deleteButtonText}>
                {language === 'english'? 'Delete' : 'ඉවත් කරන්න'}
              </Text>
            </TouchableOpacity>

          </View>
        )}
      />
    </View>
  </View>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#fff',
},
addProductSection: {
  backgroundColor: '#f9f9f9',
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},
productList: {
  flex: 1,
  paddingTop: 15,
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
addButton: {
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
  alignItems: 'center',
  padding: 15,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},
productInfo: {
  flex: 1,
},
productName: {
  fontSize: 16,
  marginBottom: 5,
},
productPrice: {
  color: '#666',
},
stockControl: {
  flexDirection: 'row',
  alignItems: 'center',
},
stockLabel: {
  marginRight: 10,
},
stockInput: {
  borderWidth: 1,
  borderColor: '#ddd',
  padding: 5,
  width: 60,
  textAlign: 'center',
  borderRadius: 5,
},
deleteButton: {
  backgroundColor: 'red',
  padding: 8,
  borderRadius: 5,
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 10,
},
deleteButtonText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: 'bold',
},
});

export default StockScreen;