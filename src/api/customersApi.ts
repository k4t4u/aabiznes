import { API_BASE_URL } from './config';

export type CustomerDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type CreateCustomerDto = {
  firstName: string;
  lastName: string;
  email: string;
};

export async function getCustomers(): Promise<CustomerDto[]> {
  const response = await fetch(`${API_BASE_URL}/customers`);

  if (!response.ok) {
    throw new Error('Nie udało się pobrać klientów.');
  }

  return response.json();
}

export async function createCustomer(
  dto: CreateCustomerDto,
): Promise<CustomerDto> {
  const response = await fetch(`${API_BASE_URL}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Nie udało się utworzyć klienta.');
  }

  return response.json();
}

export async function updateCustomer(
  id: string,
  dto: CreateCustomerDto,
): Promise<CustomerDto> {
  const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Nie udało się zaktualizować klienta.');
  }

  return response.json();
}

export async function deleteCustomer(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Nie udało się usunąć klienta.');
  }
}