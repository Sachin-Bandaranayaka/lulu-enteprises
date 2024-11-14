import React, { useState, useContext, useEffect } from 'react';
import { 
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import axios from 'axios';
import { LanguageContext } from '../LanguageContext';
import { AppContext } from '../AppContext';
import ProductItem from '../components/ProductItem';
import { PRODUCTS_API, INVOICES_API, DISCOUNT_RULES_API } from '../config';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosInstance from '../utils/axiosConfig';
import RNPrint from 'react-native-print';

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
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [lastInvoice, setLastInvoice] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [products]);

  useEffect(() => {
    calculateTotals(selectedItems);
  }, [selectedItems, discountRules]);

  useEffect(() => {
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
      setLoading(true);
      const response = await axiosInstance.get(DISCOUNT_RULES_API);

      if (response.data.success) {
        setDiscountRules(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch discount rules');
      }
    } catch (error) {
      console.error('Error fetching discount rules:', error);
      showErrorAlert(error, 'discount');
    } finally {
      setLoading(false);
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

    // Sort discount rules in descending order of min_amount
    const sortedDiscountRules = [...discountRules].sort((a, b) => b.min_amount - a.min_amount);

    let applicableDiscount = 0;
    for (let rule of sortedDiscountRules) {
      if (itemsTotal >= rule.min_amount) {
        applicableDiscount = rule.percentage;
        break; // Stop once the highest applicable discount is found
      }
    }

    const discountAmount = (itemsTotal * applicableDiscount) / 100;
    setDiscount(discountAmount);
    setTotal(itemsTotal - discountAmount);
  };

  const saveInvoice = async () => {
    if (!customerDetails.storeName) {
      Alert.alert(
        language === 'english' ? 'Missing Information' : 'තොරතුරු අඩුයි',
        language === 'english' ? 'Please enter store name' : 'කරුණාකර වෙළඳසැලේ නම ඇතුළත් කරන්න'
      );
      return;
    }

    if (selectedItems.length === 0) {
      Alert.alert(
        language === 'english' ? 'No Items' : 'භාණ්ඩ නැත',
        language === 'english' ? 'Please select at least one item' : 'කරුණාකර අවම වශයෙන් එක් භාණ්ඩයක්වත් තෝරන්න'
      );
      return;
    }

    try {
      const invoiceData = {
        customerDetails,
        items: selectedItems,
        subtotal,
        discount,
        total
      };

      setLastInvoice({
        ...invoiceData,
        createdAt: new Date().toISOString(),
      });

      setModalVisible(true);

      await axios.post(INVOICES_API, invoiceData);

      
      
      // Reset form
      setSelectedItems([]);
      setCustomerDetails({ storeName: '', contactNumber: '' });
      setSubtotal(0);
      setDiscount(0);
      setTotal(0);
      
      // Alert.alert(
      //   language === 'english' ? 'Success' : 'සාර්ථකයි',
      //   language === 'english' ? 'Invoice saved successfully' : 'ඉන්වොයිසිය සාර්ථකව සුරකින ලදී'
      // );
      
      // Refresh products to get updated stock
      fetchProducts();
      
    } catch (error) {
      console.error('Error saving invoice:', error);
      Alert.alert(
        language === 'english' ? 'Error' : 'දෝෂයකි',
        language === 'english' ? 'Failed to save invoice' : 'ඉන්වොයිසිය සුරැකීමට අපොහොසත් විය'
      );
    }
  };
  const printInvoice = async () => {
    if (!lastInvoice) return;
    
    const htmlContent = `
      <h2>Invoice Details</h2>
      <p>Store Name: ${lastInvoice.customerDetails.storeName}</p>
      <p>Date: ${new Date(lastInvoice.createdAt).toLocaleDateString()}</p>
      <h3>Items:</h3>
      <ul>
        ${lastInvoice.items.map(item => `<li>${item.name || 'Unknown Product'} - ${item.quantity} x LKR ${item.price ? item.price.toLocaleString() : '0'}</li>`).join('')}
      </ul>
      <p>Subtotal: LKR ${lastInvoice.subtotal.toLocaleString()}</p>
      <p>Discount: LKR ${lastInvoice.discount.toLocaleString()}</p>
      <p>Total: LKR ${lastInvoice.total.toLocaleString()}</p>
    `;

    try {
      await RNPrint.print({
        html: htmlContent
      });
    } catch (error) {
      console.error('Error printing invoice:', error);
    }
  };



  return (
    <SafeAreaView style={{height:"100%",padding: 15, backgroundColor:"#FFF"}} > 
    <View style={styles.container}>
      <View style={styles.customerSection}>
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

      <View style={styles.productSection}>
        <Text style={styles.sectionTitle}>
          {language === 'english' ? 'Products' : 'භාණ්ඩ'}
        </Text>
        <FlatList
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
        />
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.summaryText}>
          {language === 'english' ? 'Subtotal: ' : 'උප එකතුව: '}
          LKR {subtotal.toLocaleString()}
        </Text>
        <Text style={styles.summaryText}>
          {language === 'english' ? 'Discount: ' : 'වට්ටම: '}
          LKR {discount.toLocaleString()}
        </Text>
        <Text style={styles.totalText}>
          {language === 'english' ? 'Total: ' : 'මුළු එකතුව: '}
          LKR {total.toLocaleString()}
        </Text>
        <TouchableOpacity 
          style={[styles.saveButton, isOffline && styles.disabledButton]}
          onPress={saveInvoice}
          disabled={isOffline}
        >
          <Text style={styles.saveButtonText}>
            {language === 'english' ? 'Save Invoice' : 'ඉන්වොයිසිය සුරකින්න'}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                {language === 'english'? 'Invoice Details' : 'ඉන්වොයිස විස්තර'}
              </Text>
              {lastInvoice && (
                <>
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>
                    {language === 'english' ? 'Store Name:' : 'වෙළඳසැලේ නම:'}
                  </Text>
                  <Text style={styles.itemValue}>{lastInvoice.customerDetails.storeName}</Text>
                </View>

                

                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>{language === 'english' ? 'Date:' : 'දිනය:'} </Text>
                  <Text style={styles.itemValue}>{new Date(lastInvoice.createdAt).toLocaleDateString()}</Text>
                </View>

                  <Text style={styles.modalTitle}>{language === 'english' ? 'Items' : 'අයිතමයන්'}</Text>
                  <View style={styles.separator} />
                  <FlatList
                    data={lastInvoice.items}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => (
                      <View style={styles.itemRow}>
                        <Text style={styles.itemText}>{item.name || 'Unknown Product'}</Text>
                        <Text style={styles.itemText}>{item.quantity} x LKR {item.price ? item.price.toLocaleString(): '0'}</Text>
                      </View>
                    )}
                    />
                  {/* <View style={styles.separator} /> */}

                  <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>{language === 'english' ? 'Subtotal:' : 'උප එකතුව:'}</Text>
                  <Text style={styles.itemValue}>LKR {lastInvoice.subtotal.toLocaleString()}</Text>
                </View>

                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>{language === 'english' ? 'Discount:' : 'වට්ටම:'}</Text>
                  <Text style={styles.itemValue}>LKR {lastInvoice.discount.toLocaleString()}</Text>
                </View>

                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>{language === 'english' ? 'Total:' : 'මුළු එකතුව:'}</Text>
                  <Text style={styles.itemValue}>LKR {lastInvoice.total.toLocaleString()}</Text>
                </View>

                </>
              )}
              <TouchableOpacity
              style={styles.printButton}
              onPress={(printInvoice)}
              >
                <Text style={styles.printButtonText}>
                  {language === 'english' ? 'Print' : 'Print'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  customerSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productSection: {
    flex: 1,
    paddingTop:15,
  },
  summarySection: {
    paddingTop:20,
    borderTopColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  summaryText: {
    fontSize: 16,
    marginVertical: 5,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: 'gray',
    shadowOffset: {width:0, height:2},
    shadowOpacity:0.3,
    shadowRadius:10,
    elevation:5,
    alignContent:"center"
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    margin: 10,
    textAlign: 'center',
  },
  itemRow:{
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemLabel: {
    fontSize:16,
    fontWeight:'bold',
    color:'black',
  },
  itemText: {
    fontSize: 16,
    marginVertical: 5,
    color:'#555'
  },
  printButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
  printButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginVertical: 2,
  },
});

export default InvoiceScreen;