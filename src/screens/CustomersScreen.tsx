import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  CustomerDto,
} from '../api/customersApi';

type CustomerFormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

const CustomersScreen: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);

  const editingCustomer = useMemo(
    () => customers.find(item => item.id === editingCustomerId) ?? null,
    [customers, editingCustomerId],
  );

  const loadCustomers = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się pobrać klientów.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleAddCustomer = async (values: CustomerFormValues): Promise<void> => {
    try {
      const created = await createCustomer(values);
      setCustomers(prev => [...prev, created]);
      setIsAddingCustomer(false);
    } catch (error: any) {
      Alert.alert('Błąd', error?.message || 'Nie udało się utworzyć klienta.');
    }
  };

  const handleEditCustomer = async (
    values: CustomerFormValues,
  ): Promise<void> => {
    if (!editingCustomerId) {
      return;
    }

    try {
      const updated = await updateCustomer(editingCustomerId, values);
      setCustomers(prev =>
        prev.map(item => (item.id === editingCustomerId ? updated : item)),
      );
      setEditingCustomerId(null);
    } catch (error: any) {
      Alert.alert(
        'Błąd',
        error?.message || 'Nie udało się zaktualizować klienta.',
      );
    }
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
          onPress: async () => {
            try {
              await deleteCustomer(customerId);
              setCustomers(prev => prev.filter(item => item.id !== customerId));
            } catch (error: any) {
              Alert.alert(
                'Błąd',
                error?.message || 'Nie udało się usunąć klienta.',
              );
            }
          },
        },
      ],
    );
  };

  return (
    <ScreenLayout title="Customers" subtitle="CRUD klientów z API">
      <SummaryCard title="Liczba rekordów" value={customers.length} />

      <InfoBox text="Ten ekran korzysta z prawdziwego backendu API. Klienci są pobierani, dodawani, edytowani i usuwani przez endpointy HTTP." />

      {isLoading ? <Text style={styles.statusText}>Ładowanie danych...</Text> : null}

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
  statusText: {
    fontSize: 15,
    color: '#44546A',
  },
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