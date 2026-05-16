import React, { useMemo, useState } from 'react';
import {
  Alert,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import CustomerForm from '../components/CustomerForm';
import SummaryCard from '../components/SummaryCard';
import EntityCard from '../components/EntityCard';
import InfoBox from '../components/InfoBox';
import { customers as initialCustomers } from '../data/mockData';
import { Customer } from '../models/models';

type CustomerFormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

const CustomersScreen: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);

  const editingCustomer = useMemo(
    () => customers.find(item => item.id === editingCustomerId) ?? null,
    [customers, editingCustomerId],
  );

  const handleAddCustomer = (values: CustomerFormValues): void => {
    const newCustomer: Customer = {
      id: `c${Date.now()}`,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
    };

    setCustomers(prev => [...prev, newCustomer]);
    setIsAddingCustomer(false);
  };

  const handleEditCustomer = (values: CustomerFormValues): void => {
    if (!editingCustomerId) {
      return;
    }

    setCustomers(prev =>
      prev.map(item =>
        item.id === editingCustomerId
          ? {
              ...item,
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
            }
          : item,
      ),
    );

    setEditingCustomerId(null);
  };

  const handleDeleteCustomer = (customerId: string): void => {
    Alert.alert(
      'Usuń klienta',
      'Czy na pewno chcesz usunąć tego klienta?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: () => {
            setCustomers(prev => prev.filter(item => item.id !== customerId));
          },
        },
      ],
    );
  };

  return (
    <ScreenLayout
      title="Customers"
      subtitle="CRUD klientów"
    >
      <SummaryCard title="Liczba rekordów" value={customers.length} />

      <InfoBox text="Ten ekran obsługuje pełny CRUD klientów. Klienci będą wykorzystywani jako encja powiązana w module Orders, gdzie zamówienie będzie wskazywać konkretnego klienta przez customerId." />

      {isAddingCustomer ? (
        <CustomerForm
          submitLabel="Dodaj klienta"
          onSubmit={handleAddCustomer}
          onCancel={() => setIsAddingCustomer(false)}
        />
      ) : null}

      {editingCustomer ? (
        <CustomerForm
          submitLabel="Zapisz zmiany"
          initialValues={{
            firstName: editingCustomer.firstName,
            lastName: editingCustomer.lastName,
            email: editingCustomer.email,
          }}
          onSubmit={handleEditCustomer}
          onCancel={() => setEditingCustomerId(null)}
        />
      ) : null}

      {customers.map(customer => (
        <EntityCard
          key={customer.id}
          title={`${customer.firstName} ${customer.lastName}`}
          lines={[
            `E-mail: ${customer.email}`,
            `ID: ${customer.id}`,
          ]}
          onEdit={() => setEditingCustomerId(customer.id)}
          onDelete={() => handleDeleteCustomer(customer.id)}
        />
      ))}

      {!isAddingCustomer && !editingCustomer ? (
        <Pressable
          style={styles.primaryButton}
          onPress={() => setIsAddingCustomer(true)}
        >
          <Text style={styles.primaryButtonText}>Dodaj nowego klienta</Text>
        </Pressable>
      ) : null}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: '#2E6BE6',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CustomersScreen;