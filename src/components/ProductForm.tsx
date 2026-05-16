import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from 'react-native';

type CategoryOption = {
  id: string;
  name: string;
};

type ProductFormValues = {
  name: string;
  price: string;
  categoryId: string;
};

type ProductFormProps = {
  initialValues?: ProductFormValues;
  categories: CategoryOption[];
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
  submitLabel: string;
};

const ProductForm: React.FC<ProductFormProps> = ({
  initialValues,
  categories,
  onSubmit,
  onCancel,
  submitLabel,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setPrice(initialValues.price);
      setCategoryId(initialValues.categoryId);
    } else if (categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [initialValues, categories]);

  const handleSubmit = (): void => {
    if (!name.trim() || !price.trim() || !categoryId.trim()) {
      setError('Wszystkie pola są wymagane.');
      return;
    }

    if (Number.isNaN(Number(price))) {
      setError('Cena musi być liczbą.');
      return;
    }

    setError('');

    onSubmit({
      name: name.trim(),
      price: price.trim(),
      categoryId: categoryId.trim(),
    });
  };

  const handleSelectCategory = (selectedCategoryId: string): void => {
    setCategoryId(selectedCategoryId);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Formularz produktu</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.label}>Nazwa produktu</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Np. Laptop Dell"
        placeholderTextColor="#8A94A6"
      />

      <Text style={styles.label}>Cena</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Np. 4200"
        placeholderTextColor="#8A94A6"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Kategoria</Text>
      <View style={styles.categoriesContainer}>
        {categories.map(category => {
          const isSelected = category.id === categoryId;

          return (
            <Pressable
              key={category.id}
              style={[
                styles.categoryChip,
                isSelected ? styles.categoryChipSelected : null,
              ]}
              onPress={() => handleSelectCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  isSelected ? styles.categoryChipTextSelected : null,
                ]}
              >
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Anuluj</Text>
        </Pressable>

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{submitLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 4,
  },
  error: {
    color: '#D62828',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#44546A',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D7DFEA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1B263B',
    backgroundColor: '#FDFDFD',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  categoryChip: {
    borderWidth: 1.5,
    borderColor: '#D7DFEA',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  categoryChipSelected: {
    borderColor: '#2E6BE6',
    backgroundColor: '#EAF2FF',
  },
  categoryChipText: {
    color: '#44546A',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryChipTextSelected: {
    color: '#1E3A5F',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#2E6BE6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelButtonText: {
    color: '#2E6BE6',
    fontWeight: '700',
    fontSize: 15,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#2E6BE6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default ProductForm;