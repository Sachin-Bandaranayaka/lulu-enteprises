// screens/InvoiceScreen.js
import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageContext } from '../LanguageContext';

const initialProducts = [
  { id: 1, name: 'Detergent Powder 1kg', name_si: 'සරල කුඩු 1kg', price: 1200, stock: 50 },
  { id: 2, name: 'Detergent Powder 500g', name_si: 'සරල කුඩු 500g', price: 650, stock: 75 },
  { id: 3, name: 'Soap Bar 100g', name_si: 'සබන් 100g', price: 180, stock: 100 }
];

function InvoiceScreen({ route }) {
  const { language } = useContext(LanguageContext);
  const { isOffline } = route.params;
  const [products, setProducts] = useState(initialProducts);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({ storeName: '', contactNumber: '' });
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

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
    setDiscount(0);
    setTotal(itemsTotal);
  };

  const saveInvoice = async () => {
    if (selectedItems.length === 0 || isOffline) return;

    const invoice = {
      date: new Date(),
      customerDetails,
      items: selectedItems,
      subtotal,
      discount,
      total
    };

    try {
      const existingInvoices = await AsyncStorage.getItem('invoices');
      const invoices = existingInvoices ? JSON.parse(existingInvoices) : [];
      invoices.push(invoice);
      await AsyncStorage.setItem('invoices', JSON.stringify(invoices));

      const updatedProducts = products.map(product => {
        const soldItem = selectedItems.find(item => item.id === product.id);
        if (soldItem) {
          return { ...product, stock: product.stock - soldItem.quantity };
        }
        return product;
      });
      setProducts(updatedProducts);

      setSelectedItems([]);
      setCustomerDetails({ storeName: '', contactNumber: '' });
      setSubtotal(0);
      setDiscount(0);
      setTotal(0);

      alert(language === 'english' ? 'Invoice saved successfully' : 'ඉන්වොයිසිය සාර්ථකව සුරකින ලදී');
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert(language === 'english' ? 'Error saving invoice' : 'ඉන්වොයිසිය සුරැකීමේ දෝෂයකි');
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
          <View style={styles.productItem}>
            <Text>{language === 'english' ? item.name : item.name_si}</Text>
            <Text>LKR {item.price.toLocaleString()}</Text>
            <TextInput
              style={styles.quantityInput}
              placeholder="Qty"
              value={selectedItems.find(i => i.id === item.id)?.quantity?.toString() || ''}
              onChangeText={(text) => updateItemQuantity(item.id, parseInt(text) || 0)}
              keyboardType="numeric"
            />
          </View>
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
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 5,
    width: 50,
    textAlign: 'center',
    borderRadius: 5,
  },
  selectedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  totalSection: {
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    margin: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default InvoiceScreen;