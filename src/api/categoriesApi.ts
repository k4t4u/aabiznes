import { API_BASE_URL } from './config';

export type CategoryDto = {
  id: string;
  name: string;
};

export type CreateCategoryDto = {
  name: string;
};

export async function getCategories(): Promise<CategoryDto[]> {
  const response = await fetch(`${API_BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error('Nie udało się pobrać kategorii.');
  }

  return response.json();
}

export async function createCategory(dto: CreateCategoryDto): Promise<CategoryDto> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    throw new Error('Nie udało się utworzyć kategorii.');
  }

  return response.json();
}

export async function updateCategory(
  id: string,
  dto: CreateCategoryDto,
): Promise<CategoryDto> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    throw new Error('Nie udało się zaktualizować kategorii.');
  }

  return response.json();
}

export async function deleteCategory(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Nie udało się usunąć kategorii.');
  }
}