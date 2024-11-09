import React, { useState, useContext, useEffect } from 'react';
import { 
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import axiosInstance from '../utils/axiosConfig';
import { LanguageContext } from '../LanguageContext';
import { DISCOUNT_RULES_API, INVOICES_API } from '../config';
import { SafeAreaView } from 'react-native-safe-area-context';

function SettingsScreen() {
  const { language, setLanguage } = useContext(LanguageContext);
  const [discountRules, setDiscountRules] = useState([]);
  const [lastInvoice, setLastInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingInvoice, setLoadingInvoice] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [invoiceError, setInvoiceError] = useState(null);

  useEffect(() => {
    fetchDiscountRules();
    fetchLastInvoice();
  }, []);

  const fetchDiscountRules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(DISCOUNT_RULES_API);
      
      if (response.data.success) {
        setDiscountRules(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch discount rules');
      }
    } catch (error) {
      console.error('Error fetching discount rules:', error);
      setError(error);
      showAlert('discount');
    } finally {
      setLoading(false);
    }
  };

  const fetchLastInvoice = async () => {
    try {
      setLoadingInvoice(true);
      setInvoiceError(null);
      const response = await axiosInstance.get(`${INVOICES_API}/lastInvoice`);
      
      if (response.data.success) {
        setLastInvoice(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch last invoice');
      }
    } catch (error) {
      console.error('Error fetching last invoice:', error);
      setInvoiceError(error);
      showAlert('invoice');
    } finally {
      setLoadingInvoice(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDiscountRules();
    fetchLastInvoice();
    setRefreshing(false);
  };

  const showAlert = (type) => {
    let errorMessage = '';
    if (error && error.message === 'No internet connection') {
      errorMessage = language === 'english' 
        ? 'No internet connection. Please check your connection and try again.'
        : 'අන්තර්ජාල සම්බන්ධතාවය නැත. කරුණාකර ඔබගේ සම්බන්ධතාවය පරීක්ෂා කර නැවත උත්සාහ කරන්න.';
    } else {
      errorMessage = language === 'english'
        ? `Failed to load ${type === 'discount' ? 'discount rules' : 'invoice'}. Please try again later.`
        : `${type === 'discount' ? 'වට්ටම් නීති' : 'ඉන්වොයිස'} පූරණය කිරීමට අපොහොසත් විය. කරුණාකර පසුව නැවත උත්සාහ කරන්න.`;
    }
    Alert.alert(
      language === 'english' ? 'Error' : 'දෝෂයකි',
      errorMessage
    );
  };

  return (
    <SafeAreaView style={{height:"100%", padding: 15, backgroundColor:"#FFF"}}> 
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === 'english' ? 'Language Settings' : 'භාෂා සැකසුම්'}
          </Text>
          <View style={styles.languageButtons}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'english' && styles.selectedLanguage
              ]}
              onPress={() => setLanguage('english')}
            >
              <Text style={[
                styles.languageButtonText,
                language === 'english' && styles.selectedLanguageText
              ]}>
                English
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'sinhala' && styles.selectedLanguage
              ]}
              onPress={() => setLanguage('sinhala')}
            >
              <Text style={[
                styles.languageButtonText,
                language === 'sinhala' && styles.selectedLanguageText
              ]}>
                සිංහල
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === 'english' ? 'Discount Rules' : 'වට්ටම් නීති'}
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : error ? (
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={fetchDiscountRules}
            >
              <Text style={styles.retryButtonText}>
                {language === 'english' ? 'Retry' : 'නැවත උත්සාහ කරන්න'}
              </Text>
            </TouchableOpacity>
          ) : (
            <FlatList
              data={discountRules}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.discountRule}>
                  <Text>
                    {language === 'english' 
                      ? `Orders above LKR ${item.min_amount.toLocaleString()}`
                      : `රු. ${item.min_amount.toLocaleString()} ට වැඩි ඇණවුම් සඳහා`}
                  </Text>
                  <Text style={styles.discountPercentage}>
                    {item.percentage}%
                  </Text>
                </View>
              )}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === 'english' ? 'Last Invoice' : 'අවසන් ඉන්වොයිස'}
          </Text>
          {loadingInvoice ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : invoiceError ? (
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={fetchLastInvoice}
            >
              <Text style={styles.retryButtonText}>
                {language === 'english' ? 'Retry' : 'නැවත උත්සාහ කරන්න'}
              </Text>
            </TouchableOpacity>
          ) : lastInvoice ? (
            <View style={styles.invoiceContainer}>
              <Text>{language === 'english' ? 'Invoice ID:' : 'ඉන්වොයිස අංකය:'} {lastInvoice.id}</Text>
              <Text>{language === 'english' ? 'Amount:' : 'මුදල:'} LKR {lastInvoice.total.toLocaleString()}</Text>
              <Text>{language === 'english' ? 'Date:' : 'දිනය:'} {new Date(lastInvoice.createdAt).toLocaleDateString()}</Text>
            </View>
          ) : (
            <Text>{language === 'english' ? 'No recent invoice found.' : 'මෑතකදී ඉන්වොයිසක් හමු නොවීය.'}</Text>
          )}
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={fetchLastInvoice}
          >
            <Text style={styles.refreshButtonText}>
              {language === 'english' ? 'Refresh' : 'නැවත පූරණය කරන්න'}
            </Text>
          </TouchableOpacity>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  languageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  languageButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007AFF',
    width: '45%',
    alignItems: 'center',
  },
  selectedLanguage: {
    backgroundColor: '#007AFF',
  },
  languageButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  selectedLanguageText: {
    color: '#fff',
  },
  discountRule: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    marginBottom: 10,
    borderRadius: 5,
  },
  discountPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  invoiceContainer: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SettingsScreen;