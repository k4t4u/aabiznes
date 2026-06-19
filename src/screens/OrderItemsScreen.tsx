import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  getOrderItems,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
  OrderItemDto,
} from '../api/orderItemsApi';
import {
  getOrders,
  OrderDto,
} from '../api/ordersApi';
import {
  getProducts,
  ProductDto,
} from '../api/productsApi';

type OrderItemFormValues = {
  orderId: string;
  productId: string;
  quantity: string;
};

const OrderItemsScreen: React.FC = () => {
  const [orderItems, setOrderItems] = useState<OrderItemDto[]>([]);
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddingOrderItem, setIsAddingOrderItem] = useState(false);
  const [editingOrderItemId, setEditingOrderItemId] = useState<string | null>(null);

  const editingOrderItem = useMemo(
    () => orderItems.find(item => item.id === editingOrderItemId) ?? null,
    [orderItems, editingOrderItemId],
  );

  const loadData = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      const [orderItemsData, ordersData, productsData] = await Promise.all([
        getOrderItems(),
        getOrders(),
        getProducts(),
      ]);

      setOrderItems(orderItemsData);
      setOrders(ordersData);
      setProducts(productsData);
    } catch (error) {
      Alert.alert(
        'Błąd',
        'Nie udało się pobrać pozycji zamówień, zamówień lub produktów.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddOrderItem = async (
    values: OrderItemFormValues,
  ): Promise<void> => {
    try {
      const created = await createOrderItem({
        orderId: values.orderId,
        productId: values.productId,
        quantity: Number(values.quantity),
      });

      setOrderItems(prev => [...prev, created]);
      setIsAddingOrderItem(false);
    } catch (error: any) {
      Alert.alert(
        'Błąd',
        error?.message || 'Nie udało się utworzyć pozycji zamówienia.',
      );
    }
  };

  const handleEditOrderItem = async (
    values: OrderItemFormValues,
  ): Promise<void> => {
    if (!editingOrderItemId) {
      return;
    }

    try {
      const updated = await updateOrderItem(editingOrderItemId, {
        orderId: values.orderId,
        productId: values.productId,
        quantity: Number(values.quantity),
      });

      setOrderItems(prev =>
        prev.map(item => (item.id === editingOrderItemId ? updated : item)),
      );

      setEditingOrderItemId(null);
    } catch (error: any) {
      Alert.alert(
        'Błąd',
        error?.message || 'Nie udało się zaktualizować pozycji zamówienia.',
      );
    }
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
          onPress: async () => {
            try {
              await deleteOrderItem(orderItemId);
              setOrderItems(prev => prev.filter(item => item.id !== orderItemId));
            } catch (error: any) {
              Alert.alert(
                'Błąd',
                error?.message || 'Nie udało się usunąć pozycji zamówienia.',
              );
            }
          },
        },
      ],
    );
  };

  return (
    <ScreenLayout
      title="Order Items"
      subtitle="Relacja wiele do wielu przez API"
    >
      <SummaryCard title="Liczba rekordów" value={orderItems.length} />

      <InfoBox text="Ten ekran korzysta z backendu API. Encja OrderItem realizuje relację wiele do wielu pomiędzy Order oraz Product." />

      {isLoading ? <Text style={styles.statusText}>Ładowanie danych...</Text> : null}

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
            `Zamówienie: ${orderItem.orderLabel}`,
            `Produkt: ${orderItem.productName}`,
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

export default OrderItemsScreen;