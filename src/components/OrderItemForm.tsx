import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from 'react-native';

type OrderOption = {
  id: string;
};

type ProductOption = {
  id: string;
  name: string;
};

type OrderItemFormValues = {
  orderId: string;
  productId: string;
  quantity: string;
};

type OrderItemFormProps = {
  initialValues?: OrderItemFormValues;
  orders: OrderOption[];
  products: ProductOption[];
  onSubmit: (values: OrderItemFormValues) => void;
  onCancel: () => void;
  submitLabel: string;
};

const OrderItemForm: React.FC<OrderItemFormProps> = ({
  initialValues,
  orders,
  products,
  onSubmit,
  onCancel,
  submitLabel,
}) => {
  const [orderId, setOrderId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setOrderId(initialValues.orderId);
      setProductId(initialValues.productId);
      setQuantity(initialValues.quantity);
    } else {
      if (orders.length > 0) {
        setOrderId(orders[0].id);
      }
      if (products.length > 0) {
        setProductId(products[0].id);
      }
    }
  }, [initialValues, orders, products]);

  const handleSubmit = (): void => {
    if (!orderId.trim() || !productId.trim() || !quantity.trim()) {
      setError('Wszystkie pola są wymagane.');
      return;
    }

    if (Number.isNaN(Number(quantity))) {
      setError('Ilość musi być liczbą.');
      return;
    }

    setError('');

    onSubmit({
      orderId: orderId.trim(),
      productId: productId.trim(),
      quantity: quantity.trim(),
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Formularz pozycji zamówienia</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.label}>Zamówienie</Text>
      <View style={styles.optionsContainer}>
        {orders.map(order => {
          const isSelected = order.id === orderId;

          return (
            <Pressable
              key={order.id}
              style={[
                styles.optionChip,
                isSelected ? styles.optionChipSelected : null,
              ]}
              onPress={() => setOrderId(order.id)}
            >
              <Text
                style={[
                  styles.optionChipText,
                  isSelected ? styles.optionChipTextSelected : null,
                ]}
              >
                {order.id}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Produkt</Text>
      <View style={styles.optionsContainer}>
        {products.map(product => {
          const isSelected = product.id === productId;

          return (
            <Pressable
              key={product.id}
              style={[
                styles.optionChip,
                isSelected ? styles.optionChipSelected : null,
              ]}
              onPress={() => setProductId(product.id)}
            >
              <Text
                style={[
                  styles.optionChipText,
                  isSelected ? styles.optionChipTextSelected : null,
                ]}
              >
                {product.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Ilość</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        placeholder="Np. 2"
        placeholderTextColor="#8A94A6"
        keyboardType="numeric"
      />

      <View style={styles.actions}>
        <Pressable style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Anuluj</Text>
        </Pressable>

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{submitLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 4,
  },
  error: {
    color: '#D62828',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#44546A',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D7DFEA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1B263B',
    backgroundColor: '#FDFDFD',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  optionChip: {
    borderWidth: 1.5,
    borderColor: '#D7DFEA',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  optionChipSelected: {
    borderColor: '#2E6BE6',
    backgroundColor: '#EAF2FF',
  },
  optionChipText: {
    color: '#44546A',
    fontSize: 14,
    fontWeight: '600',
  },
  optionChipTextSelected: {
    color: '#1E3A5F',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#2E6BE6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelButtonText: {
    color: '#2E6BE6',
    fontWeight: '700',
    fontSize: 15,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#2E6BE6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default OrderItemForm;