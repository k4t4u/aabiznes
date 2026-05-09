import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from 'react-native';

type OrderFormValues = {
  customerId: string;
  status: string;
  createdAt: string;
};

type OrderFormProps = {
  initialValues?: OrderFormValues;
  onSubmit: (values: OrderFormValues) => void;
  onCancel: () => void;
  submitLabel: string;
};

const OrderForm: React.FC<OrderFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
}) => {
  const [customerId, setCustomerId] = useState('');
  const [status, setStatus] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setCustomerId(initialValues.customerId);
      setStatus(initialValues.status);
      setCreatedAt(initialValues.createdAt);
    }
  }, [initialValues]);

  const handleSubmit = (): void => {
    if (!customerId.trim() || !status.trim() || !createdAt.trim()) {
      setError('Wszystkie pola są wymagane.');
      return;
    }

    setError('');

    onSubmit({
      customerId: customerId.trim(),
      status: status.trim(),
      createdAt: createdAt.trim(),
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Formularz zamówienia</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.label}>Customer ID</Text>
      <TextInput
        style={styles.input}
        value={customerId}
        onChangeText={setCustomerId}
        placeholder="Np. c1"
        placeholderTextColor="#8A94A6"
      />

      <Text style={styles.label}>Status</Text>
      <TextInput
        style={styles.input}
        value={status}
        onChangeText={setStatus}
        placeholder="Np. Nowe"
        placeholderTextColor="#8A94A6"
      />

      <Text style={styles.label}>Data utworzenia</Text>
      <TextInput
        style={styles.input}
        value={createdAt}
        onChangeText={setCreatedAt}
        placeholder="Np. 2026-02-01"
        placeholderTextColor="#8A94A6"
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

export default OrderForm;
