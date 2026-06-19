import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import OrderForm from '../components/OrderForm';
import SummaryCard from '../components/SummaryCard';
import EntityCard from '../components/EntityCard';
import InfoBox from '../components/InfoBox';
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  OrderDto,
} from '../api/ordersApi';
import {
  getCustomers,
  CustomerDto,
} from '../api/customersApi';

type OrderFormValues = {
  customerId: string;
  status: string;
  createdAt: string;
};

const OrdersScreen: React.FC = () => {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddingOrder, setIsAddingOrder] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  const editingOrder = useMemo(
    () => orders.find(item => item.id === editingOrderId) ?? null,
    [orders, editingOrderId],
  );

  const loadData = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      const [ordersData, customersData] = await Promise.all([
        getOrders(),
        getCustomers(),
      ]);

      setOrders(ordersData);
      setCustomers(customersData);
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się pobrać zamówień lub klientów.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddOrder = async (values: OrderFormValues): Promise<void> => {
    try {
      const created = await createOrder(values);
      setOrders(prev => [...prev, created]);
      setIsAddingOrder(false);
    } catch (error: any) {
      Alert.alert('Błąd', error?.message || 'Nie udało się utworzyć zamówienia.');
    }
  };

  const handleEditOrder = async (values: OrderFormValues): Promise<void> => {
    if (!editingOrderId) {
      return;
    }

    try {
      const updated = await updateOrder(editingOrderId, values);
      setOrders(prev =>
        prev.map(item => (item.id === editingOrderId ? updated : item)),
      );
      setEditingOrderId(null);
    } catch (error: any) {
      Alert.alert(
        'Błąd',
        error?.message || 'Nie udało się zaktualizować zamówienia.',
      );
    }
  };

  const handleDeleteOrder = (orderId: string): void => {
    Alert.alert(
      'Usuń zamówienie',
      'Czy na pewno chcesz usunąć to zamówienie?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteOrder(orderId);
              setOrders(prev => prev.filter(item => item.id !== orderId));
            } catch (error: any) {
              Alert.alert(
                'Błąd',
                error?.message || 'Nie udało się usunąć zamówienia.',
              );
            }
          },
        },
      ],
    );
  };

  return (
    <ScreenLayout
      title="Orders"
      subtitle="CRUD zamówień z API i relacją do klientów"
    >
      <SummaryCard title="Liczba rekordów" value={orders.length} />

      <InfoBox text="Ten ekran korzysta z backendu API. Zamówienia i klienci są pobierani z serwera, a relacja Order -> Customer działa przez prawdziwy klucz obcy." />

      {isLoading ? <Text style={styles.statusText}>Ładowanie danych...</Text> : null}

      {isAddingOrder ? (
        <OrderForm
          customers={customers}
          submitLabel="Dodaj zamówienie"
          onSubmit={handleAddOrder}
          onCancel={() => setIsAddingOrder(false)}
        />
      ) : null}

      {editingOrder ? (
        <OrderForm
          customers={customers}
          submitLabel="Zapisz zmiany"
          initialValues={{
            customerId: editingOrder.customerId,
            status: editingOrder.status,
            createdAt: editingOrder.createdAt,
          }}
          onSubmit={handleEditOrder}
          onCancel={() => setEditingOrderId(null)}
        />
      ) : null}

      {orders.map(order => (
        <EntityCard
          key={order.id}
          title={`Zamówienie ${order.id}`}
          lines={[
            `Klient: ${order.customerName}`,
            `customerId: ${order.customerId}`,
            `Status: ${order.status}`,
            `Data: ${order.createdAt}`,
          ]}
          onEdit={() => setEditingOrderId(order.id)}
          onDelete={() => handleDeleteOrder(order.id)}
        />
      ))}

      {!isAddingOrder && !editingOrder ? (
        <Pressable
          style={styles.primaryButton}
          onPress={() => setIsAddingOrder(true)}
        >
          <Text style={styles.primaryButtonText}>Dodaj nowe zamówienie</Text>
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

export default OrdersScreen;