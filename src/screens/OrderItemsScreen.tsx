import React, { useMemo, useState } from 'react';
import {
  Alert,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import OrderItemForm from '../components/OrderItemForm';
import SummaryCard from '../components/SummaryCard';
import EntityCard from '../components/EntityCard';
import InfoBox from '../components/InfoBox';
import {
  orderItems as initialOrderItems,
  orders as initialOrders,
  products as initialProducts,
} from '../data/mockData';
import { OrderItem, Order, Product } from '../models/models';

type OrderItemFormValues = {
  orderId: string;
  productId: string;
  quantity: string;
};

const OrderItemsScreen: React.FC = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>(initialOrderItems);
  const [orders] = useState<Order[]>(initialOrders);
  const [products] = useState<Product[]>(initialProducts);

  const [isAddingOrderItem, setIsAddingOrderItem] = useState(false);
  const [editingOrderItemId, setEditingOrderItemId] = useState<string | null>(null);

  const editingOrderItem = useMemo(
    () => orderItems.find(item => item.id === editingOrderItemId) ?? null,
    [orderItems, editingOrderItemId],
  );

  const getOrderLabel = (orderId: string): string => {
    const order = orders.find(item => item.id === orderId);
    return order ? `Zamówienie ${order.id}` : 'Nieznane zamówienie';
  };

  const getProductName = (productId: string): string => {
    const product = products.find(item => item.id === productId);
    return product ? product.name : 'Nieznany produkt';
  };

  const handleAddOrderItem = (values: OrderItemFormValues): void => {
    const newOrderItem: OrderItem = {
      id: `oi${Date.now()}`,
      orderId: values.orderId,
      productId: values.productId,
      quantity: Number(values.quantity),
    };

    setOrderItems(prev => [...prev, newOrderItem]);
    setIsAddingOrderItem(false);
  };

  const handleEditOrderItem = (values: OrderItemFormValues): void => {
    if (!editingOrderItemId) {
      return;
    }

    setOrderItems(prev =>
      prev.map(item =>
        item.id === editingOrderItemId
          ? {
              ...item,
              orderId: values.orderId,
              productId: values.productId,
              quantity: Number(values.quantity),
            }
          : item,
      ),
    );

    setEditingOrderItemId(null);
  };

  const handleDeleteOrderItem = (orderItemId: string): void => {
    Alert.alert(
      'Usuń pozycję zamówienia',
      'Czy na pewno chcesz usunąć tę pozycję zamówienia?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: () => {
            setOrderItems(prev => prev.filter(item => item.id !== orderItemId));
          },
        },
      ],
    );
  };

  return (
    <ScreenLayout
      title="Order Items"
      subtitle="Relacja wiele do wielu: Order ↔ Product"
    >
      <SummaryCard title="Liczba rekordów" value={orderItems.length} />

      <InfoBox text="Encja OrderItem realizuje relację wiele do wielu pomiędzy Order oraz Product. Jedno zamówienie może zawierać wiele produktów, a jeden produkt może występować w wielu zamówieniach." />

      {isAddingOrderItem ? (
        <OrderItemForm
          orders={orders.map(order => ({ id: order.id }))}
          products={products.map(product => ({
            id: product.id,
            name: product.name,
          }))}
          submitLabel="Dodaj pozycję"
          onSubmit={handleAddOrderItem}
          onCancel={() => setIsAddingOrderItem(false)}
        />
      ) : null}

      {editingOrderItem ? (
        <OrderItemForm
          orders={orders.map(order => ({ id: order.id }))}
          products={products.map(product => ({
            id: product.id,
            name: product.name,
          }))}
          submitLabel="Zapisz zmiany"
          initialValues={{
            orderId: editingOrderItem.orderId,
            productId: editingOrderItem.productId,
            quantity: String(editingOrderItem.quantity),
          }}
          onSubmit={handleEditOrderItem}
          onCancel={() => setEditingOrderItemId(null)}
        />
      ) : null}

      {orderItems.map(orderItem => (
        <EntityCard
          key={orderItem.id}
          title={`Pozycja ${orderItem.id}`}
          lines={[
            `Zamówienie: ${getOrderLabel(orderItem.orderId)}`,
            `Produkt: ${getProductName(orderItem.productId)}`,
            `Ilość: ${orderItem.quantity}`,
            `orderId: ${orderItem.orderId}`,
            `productId: ${orderItem.productId}`,
          ]}
          onEdit={() => setEditingOrderItemId(orderItem.id)}
          onDelete={() => handleDeleteOrderItem(orderItem.id)}
        />
      ))}

      {!isAddingOrderItem && !editingOrderItem ? (
        <Pressable
          style={styles.primaryButton}
          onPress={() => setIsAddingOrderItem(true)}
        >
          <Text style={styles.primaryButtonText}>Dodaj nową pozycję</Text>
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

export default OrderItemsScreen;