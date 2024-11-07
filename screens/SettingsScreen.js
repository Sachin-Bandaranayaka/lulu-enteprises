import React, { useState, useContext, useEffect } from 'react';
import { 
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import axiosInstance from '../utils/axiosConfig';
import { LanguageContext } from '../LanguageContext';
import { DISCOUNT_RULES_API } from '../config';

function SettingsScreen() {
  const { language, setLanguage } = useContext(LanguageContext);
  const [discountRules, setDiscountRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDiscountRules();
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
      
      let errorMessage = '';
      if (error.message === 'No internet connection') {
        errorMessage = language === 'english' 
          ? 'No internet connection. Please check your connection and try again.'
          : 'අන්තර්ජාල සම්බන්ධතාවය නැත. කරුණාකර ඔබගේ සම්බන්ධතාවය පරීක්ෂා කර නැවත උත්සාහ කරන්න.';
      } else {
        errorMessage = language === 'english'
          ? 'Failed to load discount rules. Please try again later.'
          : 'වට්ටම් නීති පූරණය කිරීමට අපොහොසත් විය. කරුණාකර පසුව නැවත උත්සාහ කරන්න.';
      }
      
      Alert.alert(
        language === 'english' ? 'Error' : 'දෝෂයකි',
        errorMessage
      );
    } finally {
      setLoading(false);
    }
  };

  return (
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
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
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
});

export default SettingsScreen;