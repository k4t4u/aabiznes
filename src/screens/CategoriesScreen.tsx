import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import CategoryForm from '../components/CategoryForm';
import SummaryCard from '../components/SummaryCard';
import EntityCard from '../components/EntityCard';
import InfoBox from '../components/InfoBox';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  CategoryDto,
} from '../api/categoriesApi';

type CategoryFormValues = {
  name: string;
};

const CategoriesScreen: React.FC = () => {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const editingCategory = useMemo(
    () => categories.find(item => item.id === editingCategoryId) ?? null,
    [categories, editingCategoryId],
  );

  const loadCategories = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się pobrać kategorii.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleAddCategory = async (values: CategoryFormValues): Promise<void> => {
    try {
      const created = await createCategory({
        name: values.name,
      });

      setCategories(prev => [...prev, created]);
      setIsAddingCategory(false);
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się utworzyć kategorii.');
    }
  };

  const handleEditCategory = async (values: CategoryFormValues): Promise<void> => {
    if (!editingCategoryId) {
      return;
    }

    try {
      const updated = await updateCategory(editingCategoryId, {
        name: values.name,
      });

      setCategories(prev =>
        prev.map(item => (item.id === editingCategoryId ? updated : item)),
      );

      setEditingCategoryId(null);
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się zaktualizować kategorii.');
    }
  };

  const handleDeleteCategory = (categoryId: string): void => {
    Alert.alert(
      'Usuń kategorię',
      'Czy na pewno chcesz usunąć tę kategorię?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(categoryId);
              setCategories(prev => prev.filter(item => item.id !== categoryId));
            } catch (error: any) {
              Alert.alert(
                'Błąd',
                error?.message || 'Nie udało się usunąć kategorii.',
              );
            }
          },
        },
      ],
    );
  };

  return (
    <ScreenLayout
      title="Categories"
      subtitle="CRUD kategorii z API"
    >
      <SummaryCard title="Liczba rekordów" value={categories.length} />

      <InfoBox text="Ten ekran korzysta z prawdziwego backendu API. Kategorie są pobierane, dodawane, edytowane i usuwane przez endpointy HTTP." />

      {isLoading ? <Text style={styles.statusText}>Ładowanie danych...</Text> : null}

      {isAddingCategory ? (
        <CategoryForm
          submitLabel="Dodaj kategorię"
          onSubmit={handleAddCategory}
          onCancel={() => setIsAddingCategory(false)}
        />
      ) : null}

      {editingCategory ? (
        <CategoryForm
          submitLabel="Zapisz zmiany"
          initialValues={{
            name: editingCategory.name,
          }}
          onSubmit={handleEditCategory}
          onCancel={() => setEditingCategoryId(null)}
        />
      ) : null}

      {categories.map(category => (
        <EntityCard
          key={category.id}
          title={category.name}
          lines={[`ID: ${category.id}`]}
          onEdit={() => setEditingCategoryId(category.id)}
          onDelete={() => handleDeleteCategory(category.id)}
        />
      ))}

      {!isAddingCategory && !editingCategory ? (
        <Pressable
          style={styles.primaryButton}
          onPress={() => setIsAddingCategory(true)}
        >
          <Text style={styles.primaryButtonText}>Dodaj nową kategorię</Text>
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

export default CategoriesScreen;