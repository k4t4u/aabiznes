import React, { useMemo, useState } from 'react';
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
import { categories as initialCategories } from '../data/mockData';
import { Category } from '../models/models';

type CategoryFormValues = {
  name: string;
};

const CategoriesScreen: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const editingCategory = useMemo(
    () => categories.find(item => item.id === editingCategoryId) ?? null,
    [categories, editingCategoryId],
  );

  const handleAddCategory = (values: CategoryFormValues): void => {
    const newCategory: Category = {
      id: `cat${Date.now()}`,
      name: values.name,
    };

    setCategories(prev => [...prev, newCategory]);
    setIsAddingCategory(false);
  };

  const handleEditCategory = (values: CategoryFormValues): void => {
    if (!editingCategoryId) {
      return;
    }

    setCategories(prev =>
      prev.map(item =>
        item.id === editingCategoryId
          ? {
              ...item,
              name: values.name,
            }
          : item,
      ),
    );

    setEditingCategoryId(null);
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
          onPress: () => {
            setCategories(prev => prev.filter(item => item.id !== categoryId));
          },
        },
      ],
    );
  };

  return (
    <ScreenLayout
      title="Categories"
      subtitle="CRUD kategorii"
    >
      <SummaryCard title="Liczba rekordów" value={categories.length} />

      <InfoBox text="Ten ekran obsługuje pełny CRUD kategorii. Kategorie są encją nadrzędną dla produktów, ponieważ produkt przechowuje klucz obcy categoryId wskazujący konkretną kategorię." />

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
          lines={[
            `ID: ${category.id}`,
          ]}
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