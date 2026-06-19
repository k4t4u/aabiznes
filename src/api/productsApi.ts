import { API_BASE_URL } from './config';

export type ProductDto = {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  categoryName: string;
};

export type CreateProductDto = {
  name: string;
  price: number;
  categoryId: string;
};

export async function getProducts(): Promise<ProductDto[]> {
  const response = await fetch(`${API_BASE_URL}/products`);

  if (!response.ok) {
    throw new Error('Nie udało się pobrać produktów.');
  }

  return response.json();
}

export async function createProduct(dto: CreateProductDto): Promise<ProductDto> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Nie udało się utworzyć produktu.');
  }

  return response.json();
}

export async function updateProduct(
  id: string,
  dto: CreateProductDto,
): Promise<ProductDto> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Nie udało się zaktualizować produktu.');
  }

  return response.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Nie udało się usunąć produktu.');
  }
}