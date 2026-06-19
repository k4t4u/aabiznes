import { API_BASE_URL } from './config';

export type OrderDto = {
  id: string;
  customerId: string;
  customerName: string;
  status: string;
  createdAt: string;
};

export type CreateOrderDto = {
  customerId: string;
  status: string;
  createdAt: string;
};

export async function getOrders(): Promise<OrderDto[]> {
  const response = await fetch(`${API_BASE_URL}/orders`);

  if (!response.ok) {
    throw new Error('Nie udało się pobrać zamówień.');
  }

  return response.json();
}

export async function createOrder(dto: CreateOrderDto): Promise<OrderDto> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Nie udało się utworzyć zamówienia.');
  }

  return response.json();
}

export async function updateOrder(
  id: string,
  dto: CreateOrderDto,
): Promise<OrderDto> {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Nie udało się zaktualizować zamówienia.');
  }

  return response.json();
}

export async function deleteOrder(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Nie udało się usunąć zamówienia.');
  }
}