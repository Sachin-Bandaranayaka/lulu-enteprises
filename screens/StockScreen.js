// screens/StockScreen.js
import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet 
} from 'react-native';
import { LanguageContext } from '../LanguageContext';

function StockScreen() {
  const { language } = useContext(LanguageContext);
  const [products, setProducts] = useState([
    { id: 1, name: 'Detergent Powder 1kg', name_si: 'සරල කුඩු 1kg', price: 1200, stock: 50 },
    { id: 2, name: 'Detergent Powder 500g', name_si: 'සරල කුඩු 500g', price: 650, stock: 75 },
    { id: 3, name: 'Soap Bar 100g', name_si: 'සබන් 100g', price: 180, stock: 100 }
  ]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    name_si: '',
    price: '',
    stock: ''
  });

  const addProduct = () => {
    if (newProduct.name && newProduct.name_si && newProduct.price && newProduct.stock) {
      setProducts([...products, {
        id: products.length + 1,
        name: newProduct.name,
        name_si: newProduct.name_si,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock)
      }]);
      setNewProduct({ name: '', name_si: '', price: '', stock: '' });
    }
  };

  const updateStock = (id, newStock) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, stock: parseInt(newStock) || 0 } : product
    ));
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  stockInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 5,
    width: 60,
    textAlign: 'center',
    marginLeft: 10,
    borderRadius: 5,
  },
});

export default StockScreen;