// screens/InvoiceScreen.js
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
import ProductItem from '../components/ProductItem';

function InvoiceScreen({ route }) {
  const { language } = useContext(LanguageContext);
  const { isOffline } = route.params;
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({ storeName: '', contactNumber: '' });
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/products`); // Replace with your server URL
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert(
        language === 'english' ? 'Error' : 'දෝෂයකි',
        language === 'english' ? 'Failed to load products' : 'භාණ්ඩ පූරණය කිරීමට අපොහොසත් විය'
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
    // Here you can apply discount rules fetched from the backend
    setDiscount(0); // Update this if discount rules are applied
    setTotal(itemsTotal - discount);
  };

  const saveInvoice = async () => {
    if (selectedItems.length === 0 || isOffline) return;

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
      await axios.post(`${BASE_URL}/api/invoices`, invoiceData); // Replace with your server URL

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
      <FlatList
        ListHeaderComponent={() => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {language === 'english' ? 'Customer Details' : 'පාරිභෝගික තොරතුරු'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={language === 'english' ? "Store Name" : "වෙළඳසැලේ නම"}
              value={customerDetails.storeName}
              onChangeText={(text) => setCustomerDetails(prev => ({ ...prev, storeName: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder={language === 'english' ? "Contact Number" : "දුරකථන අංකය"}
              value={customerDetails.contactNumber}
              onChangeText={(text) => setCustomerDetails(prev => ({ ...prev, contactNumber: text }))}
              keyboardType="phone-pad"
            />
          </View>
        )}
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem
            product={item}
            language={language}
            onQuantityChange={(quantity) => updateItemQuantity(item.id, quantity)}
            selectedQuantity={selectedItems.find(i => i.id === item.id)?.quantity || 0}
          />
        )}
        ListFooterComponent={() => (
          <>
            {selectedItems.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {language === 'english' ? 'Selected Items' : 'තෝරාගත් භාණ්ඩ'}
                </Text>
                <FlatList
                  scrollEnabled={false}
                  data={selectedItems}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.selectedItem}>
                      <Text>{language === 'english' ? item.name : item.name_si}</Text>
                      <Text>LKR {item.price.toLocaleString()} x {item.quantity}</Text>
                      <Text>LKR {item.total.toLocaleString()}</Text>
                    </View>
                  )}
                />
                <View style={styles.totalSection}>
                  <Text>{language === 'english' ? 'Subtotal' : 'උප එකතුව'}: LKR {subtotal.toLocaleString()}</Text>
                  <Text>{language === 'english' ? 'Discount' : 'වට්ටම'}: LKR {discount.toLocaleString()}</Text>
                  <Text style={styles.totalText}>
                    {language === 'english' ? 'Total' : 'මුළු එකතුව'}: LKR {total.toLocaleString()}
                  </Text>
                </View>
              </View>
            )}
            <TouchableOpacity
              style={[styles.button, (selectedItems.length === 0 || isOffline) && styles.disabledButton]}
              onPress={saveInvoice}
              disabled={selectedItems.length === 0 || isOffline}
            >
              <Text style={styles.buttonText}>
                {language === 'english' ? 'Save Invoice' : 'ඉන්වොයිසිය සුරකින්න'}
              </Text>
            </TouchableOpacity>
          </>
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
  section: {
    padding: 15,
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
  },
  selectedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  totalSection: {
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    margin: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default InvoiceScreen;