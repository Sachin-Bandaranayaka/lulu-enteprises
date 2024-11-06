// screens/ExpensesScreen.js
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

function ExpensesScreen() {
  const { language } = useContext(LanguageContext);
  const [expenses, setExpenses] = useState({
    vehicle: [],
    maintenance: [],
    fuel: [],
    other: []
  });
  const [newExpense, setNewExpense] = useState({
    type: 'vehicle',
    amount: '',
    description: ''
  });

  const getExpenseTypeSinhala = (type) => {
    const translations = {
      vehicle: 'වාහන',
      maintenance: 'නඩත්තු',
      fuel: 'ඉන්ධන',
      other: 'වෙනත්'
    };
    return translations[type] || type;
  };

  const addExpense = () => {
    if (newExpense.amount && newExpense.description) {
      setExpenses(prev => ({
        ...prev,
        [newExpense.type]: [
          ...prev[newExpense.type],
          {
            id: Date.now(),
            amount: parseFloat(newExpense.amount),
            description: newExpense.description,
            date: new Date()
          }
        ]
      }));
      setNewExpense({ ...newExpense, amount: '', description: '' });
    }
  };

  const renderExpenseSection = (type) => {
    const typeExpenses = expenses[type];
    const total = typeExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    return (
      <View style={styles.expenseSection}>
        <Text style={styles.expenseType}>
          {language === 'english' ? type.charAt(0).toUpperCase() + type.slice(1) : getExpenseTypeSinhala(type)}
        </Text>
        <Text style={styles.expenseTotal}>
          {language === 'english' ? 'Total:' : 'එකතුව:'} LKR {total.toLocaleString()}
        </Text>
        <FlatList
          data={typeExpenses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.expenseItem}>
              <Text>{item.description}</Text>
              <Text>LKR {item.amount.toLocaleString()}</Text>
            </View>
          )}
        />
      </View>
    );
  };

  return (
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
        />
        <TextInput
          style={styles.input}
          placeholder={language === 'english' ? "Description" : "විස්තරය"}
          value={newExpense.description}
          onChangeText={(text) => setNewExpense(prev => ({ ...prev, description: text }))}
        />
        <TouchableOpacity style={styles.button} onPress={addExpense}>
          <Text style={styles.buttonText}>
            {language === 'english' ? 'Add Expense' : 'වියදම එකතු කරන්න'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={Object.keys(expenses)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => renderExpenseSection(item)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  addExpenseSection: {
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
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  typeButton: {
    padding: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedType: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeButtonText: {
    color: '#333',
  },
  selectedTypeText: {
    color: '#fff',
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
  expenseSection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  expenseType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  expenseTotal: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 5,
    borderRadius: 5,
  },
});

export default ExpensesScreen;