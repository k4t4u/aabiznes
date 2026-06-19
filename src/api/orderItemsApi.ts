import { API_BASE_URL } from './config';

export type OrderItemDto = {
  id: string;
  orderId: string;
  orderLabel: string;
  productId: string;
  productName: string;
  quantity: number;
};

export type CreateOrderItemDto = {
  orderId: string;
  productId: string;
  quantity: number;
};

export async function getOrderItems(): Promise<OrderItemDto[]> {
  const response = await fetch(`${API_BASE_URL}/orderitems`);

  if (!response.ok) {
    throw new Error('Nie udało się pobrać pozycji zamówień.');
  }

  return response.json();
}

export async function createOrderItem(
  dto: CreateOrderItemDto,
): Promise<OrderItemDto> {
  const response = await fetch(`${API_BASE_URL}/orderitems`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Nie udało się utworzyć pozycji zamówienia.');
  }

  return response.json();
}

export async function updateOrderItem(
  id: string,
  dto: CreateOrderItemDto,
): Promise<OrderItemDto> {
  const response = await fetch(`${API_BASE_URL}/orderitems/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Nie udało się zaktualizować pozycji zamówienia.');
  }

  return response.json();
}

export async function deleteOrderItem(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/orderitems/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Nie udało się usunąć pozycji zamówienia.');
  }
}