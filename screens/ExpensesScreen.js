// screens/ExpensesScreen.js
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
import { EXPENSES_API } from '../config';
import { SafeAreaView } from 'react-native-safe-area-context';

function ExpensesScreen() {
  const { language } = useContext(LanguageContext);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    type: 'vehicle',
    amount: '',
    description: ''
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(EXPENSES_API);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      Alert.alert(
        language === 'english' ? 'Error' : 'දෝෂයකි',
        language === 'english' ? 'Failed to load expenses' : 'වියදම් පූරණය කිරීමට අපොහොසත් විය'
      );
    }
  };

  const getExpenseTypeSinhala = (type) => {
    const translations = {
      vehicle: 'වාහන',
      maintenance: 'නඩත්තු',
      fuel: 'ඉන්ධන',
      other: 'වෙනත්'
    };
    return translations[type] || type;
  };

  const addExpense = async () => {
    if (!newExpense.amount || !newExpense.description) {
      Alert.alert(
        language === 'english' ? 'Missing Information' : 'තොරතුරු අඩුයි',
        language === 'english' ? 'Please fill in all fields' : 'සියලුම තොරතුරු පුරවන්න'
      );
      return;
    }

    try {
      const expenseData = {
        type: newExpense.type,
        amount: parseFloat(newExpense.amount),
        description: newExpense.description,
      };
      const response = await axios.post(EXPENSES_API, expenseData);

      setExpenses([...expenses, response.data]);
      setNewExpense({ 
        type: 'vehicle',
        amount: '', 
        description: '' 
      });
      
      Alert.alert(
        language === 'english' ? 'Success' : 'සාර්ථකයි',
        language === 'english' ? 'Expense added successfully' : 'වියදම සාර්ථකව එකතු කරන ලදී'
      );
    } catch (error) {
      console.error('Error adding expense:', error);
      Alert.alert(
        language === 'english' ? 'Error' : 'දෝෂයකි',
        language === 'english' ? 'Failed to add expense' : 'වියදම එකතු කිරීමට අපොහොසත් විය'
      );
    }
  };

  const renderExpenseSection = (type) => {
    const typeExpenses = expenses.filter(exp => exp.type === type);
    const total = typeExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    return (
      <View style={styles.expenseSection}>
        <View style={styles.expenseHeader}>
          <Text style={styles.expenseType}>
            {language === 'english' ? type.charAt(0).toUpperCase() + type.slice(1) : getExpenseTypeSinhala(type)}
          </Text>
          <Text style={styles.expenseTotal}>
            {language === 'english' ? 'Total: ' : 'එකතුව: '}
            LKR {total.toLocaleString()}
          </Text>
        </View>
        
        {typeExpenses.length > 0 ? (
          <FlatList
            data={typeExpenses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.expenseItem}>
                <View style={styles.expenseDetails}>
                  <Text style={styles.expenseDescription}>{item.description}</Text>
                  <Text style={styles.expenseDate}>
                    {new Date(item.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.expenseAmount}>
                  LKR {parseFloat(item.amount).toLocaleString()}
                </Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noExpenses}>
            {language === 'english' ? 'No expenses recorded' : 'වියදම් වාර්තා කර නැත'}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{height:"100%",padding:15,backgroundColor:"#FFF"}} >
    <View style={styles.container}>
      <View style={styles.addExpenseSection}>
        <Text style={styles.sectionTitle}>
          {language === 'english' ? 'Add New Expense' : 'නව වියදමක් එකතු කරන්න'}
        </Text>
        
        <View style={styles.typeSelector}>
          {['vehicle', 'maintenance', 'fuel', 'other'].map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                newExpense.type === type && styles.selectedType
              ]}
              onPress={() => setNewExpense(prev => ({ ...prev, type }))}
            >
              <Text style={[
                styles.typeButtonText,
                newExpense.type === type && styles.selectedTypeText
              ]}>
                {language === 'english' 
                  ? type.charAt(0).toUpperCase() + type.slice(1)
                  : getExpenseTypeSinhala(type)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder={language === 'english' ? "Amount (LKR)" : "මුදල (රු.)"}
          value={newExpense.amount}
          onChangeText={(text) => setNewExpense(prev => ({ ...prev, amount: text }))}
          keyboardType="numeric"
          placeholderTextColor="#999"
        />

        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder={language === 'english' ? "Description" : "විස්තරය"}
          value={newExpense.description}
          onChangeText={(text) => setNewExpense(prev => ({ ...prev, description: text }))}
          multiline
          placeholderTextColor="#999"
        />

        <TouchableOpacity 
          style={styles.addButton}
          onPress={addExpense}
        >
          <Text style={styles.addButtonText}>
            {language === 'english' ? 'Add Expense' : 'වියදම එකතු කරන්න'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={['vehicle', 'maintenance', 'fuel', 'other']}
        keyExtractor={(item) => item}
        renderItem={({ item }) => renderExpenseSection(item)}
        style={styles.expenseList}
      />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  addExpenseSection: {
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#212529',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  typeButton: {
    padding: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#dee2e6',
    backgroundColor: '#fff',
  },
  selectedType: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeButtonText: {
    color: '#495057',
  },
  selectedTypeText: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    padding: 12,
    marginBottom: 12,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseList: {
    marginTop:15,
    flex: 1,
  },
  expenseSection: {
    paddingTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  expenseType: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#212529',
  },
  expenseTotal: {
    fontSize: 15,
    color: '#6c757d',
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
    borderRadius: 5,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    color: '#212529',
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 14,
    color: '#6c757d',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
  },
  noExpenses: {
    textAlign: 'center',
    color: '#6c757d',
    fontStyle: 'italic',
    marginTop: 10,
  },
});

export default ExpensesScreen;