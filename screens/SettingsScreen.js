// screens/SettingsScreen.js
import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet 
} from 'react-native';
import { LanguageContext } from '../LanguageContext';

function SettingsScreen() {
  const { language, setLanguage } = useContext(LanguageContext);
  const [discountRules] = useState([
    { id: 1, minAmount: 5000, percentage: 2 },
    { id: 2, minAmount: 10000, percentage: 5 },
    { id: 3, minAmount: 25000, percentage: 8 },
    { id: 4, minAmount: 50000, percentage: 10 }
  ]);

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
        <FlatList
          data={discountRules}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.discountRule}>
              <Text>
                {language === 'english' 
                  ? `Orders above LKR ${item.minAmount.toLocaleString()}`
                  : `රු. ${item.minAmount.toLocaleString()} ට වැඩි ඇණවුම් සඳහා`}
              </Text>
              <Text style={styles.discountPercentage}>
                {item.percentage}%
              </Text>
            </View>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {language === 'english' ? 'About' : 'පිළිබඳව'}
        </Text>
        <Text style={styles.aboutText}>
          {language === 'english' 
            ? 'Invoice Management System v1.0'
            : 'ඉන්වොයිස් කළමනාකරණ පද්ධතිය v1.0'}
        </Text>
      </View>
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
    marginBottom: 15,
  },
  languageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  languageButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '40%',
    alignItems: 'center',
  },
  selectedLanguage: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  languageButtonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedLanguageText: {
    color: '#fff',
  },
  discountRule: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 5,
    borderRadius: 5,
  },
  discountPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  aboutText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SettingsScreen;