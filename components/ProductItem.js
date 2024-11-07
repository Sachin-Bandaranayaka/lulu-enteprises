// components/ProductItem.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

function ProductItem({ product, language, onQuantityChange, selectedQuantity = 0 }) {
  return (
    <View style={styles.productItem}>
      <Text>{language === 'english' ? product.name : product.name_si}</Text>
      <Text>LKR {product.price.toLocaleString()}</Text>
      <TextInput
        style={styles.quantityInput}
        placeholder="Qty"
        value={selectedQuantity.toString()}
        onChangeText={(text) => onQuantityChange(parseInt(text) || 0)}
        keyboardType="numeric"
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
    width: 60,
    textAlign: 'center',
    borderRadius: 5,
  },
});

export default ProductItem;