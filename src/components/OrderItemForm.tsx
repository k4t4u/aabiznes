import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from 'react-native';

type OrderItemFormValues = {
  orderId: string;
  productId: string;
  quantity: string;
};

type OrderItemFormProps = {
  initialValues?: OrderItemFormValues;
  onSubmit: (values: OrderItemFormValues) => void;
  onCancel: () => void;
  submitLabel: string;
};

const OrderItemForm: React.FC<OrderItemFormProps> = ({
  initialValues,
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
    }
  }, [initialValues]);

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

      <Text style={styles.label}>Order ID</Text>
      <TextInput
        style={styles.input}
        value={orderId}
        onChangeText={setOrderId}
        placeholder="Np. o1"
        placeholderTextColor="#8A94A6"
      />

      <Text style={styles.label}>Product ID</Text>
      <TextInput
        style={styles.input}
        value={productId}
        onChangeText={setProductId}
        placeholder="Np. p1"
        placeholderTextColor="#8A94A6"
      />

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
