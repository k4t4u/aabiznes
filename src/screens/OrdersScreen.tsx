import React, { useMemo, useState } from 'react';
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
  orders as initialOrders,
  customers as initialCustomers,
} from '../data/mockData';
import { Order, Customer } from '../models/models';

type OrderFormValues = {
  customerId: string;
  status: string;
  createdAt: string;
};

const OrdersScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [customers] = useState<Customer[]>(initialCustomers);

  const [isAddingOrder, setIsAddingOrder] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  const editingOrder = useMemo(
    () => orders.find(item => item.id === editingOrderId) ?? null,
    [orders, editingOrderId],
  );

  const getCustomerName = (customerId: string): string => {
    const customer = customers.find(item => item.id === customerId);
    return customer
      ? `${customer.firstName} ${customer.lastName}`
      : 'Nieznany klient';
  };

  const handleAddOrder = (values: OrderFormValues): void => {
    const newOrder: Order = {
      id: `o${Date.now()}`,
      customerId: values.customerId,
      status: values.status,
      createdAt: values.createdAt,
    };

    setOrders(prev => [...prev, newOrder]);
    setIsAddingOrder(false);
  };

  const handleEditOrder = (values: OrderFormValues): void => {
    if (!editingOrderId) {
      return;
    }

    setOrders(prev =>
      prev.map(item =>
        item.id === editingOrderId
          ? {
              ...item,
              customerId: values.customerId,
              status: values.status,
              createdAt: values.createdAt,
            }
          : item,
      ),
    );

    setEditingOrderId(null);
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
          onPress: () => {
            setOrders(prev => prev.filter(item => item.id !== orderId));
          },
        },
      ],
    );
  };

  return (
    <ScreenLayout
      title="Orders"
      subtitle="CRUD zamówień z relacją do klientów"
    >
      <SummaryCard title="Liczba rekordów" value={orders.length} />

      <InfoBox text="Zamówienie posiada klucz obcy customerId wskazujący na Customer. Użytkownik wybiera klienta podczas dodawania i edycji zamówienia, a na liście wyświetlane są dane powiązanego klienta." />

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
            `Klient: ${getCustomerName(order.customerId)}`,
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