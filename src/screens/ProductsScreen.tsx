import React, { useMemo, useState } from 'react';
import {
  Alert,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import ProductForm from '../components/ProductForm';
import SummaryCard from '../components/SummaryCard';
import EntityCard from '../components/EntityCard';
import InfoBox from '../components/InfoBox';
import {
  products as initialProducts,
  categories as initialCategories,
} from '../data/mockData';
import { Product, Category } from '../models/models';

type ProductFormValues = {
  name: string;
  price: string;
  categoryId: string;
};

const ProductsScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories] = useState<Category[]>(initialCategories);

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const editingProduct = useMemo(
    () => products.find(item => item.id === editingProductId) ?? null,
    [products, editingProductId],
  );

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(item => item.id === categoryId);
    return category ? category.name : 'Nieznana kategoria';
  };

  const handleAddProduct = (values: ProductFormValues): void => {
    const newProduct: Product = {
      id: `p${Date.now()}`,
      name: values.name,
      price: Number(values.price),
      categoryId: values.categoryId,
    };

    setProducts(prev => [...prev, newProduct]);
    setIsAddingProduct(false);
  };

  const handleEditProduct = (values: ProductFormValues): void => {
    if (!editingProductId) {
      return;
    }

    setProducts(prev =>
      prev.map(item =>
        item.id === editingProductId
          ? {
              ...item,
              name: values.name,
              price: Number(values.price),
              categoryId: values.categoryId,
            }
          : item,
      ),
    );

    setEditingProductId(null);
  };

  const handleDeleteProduct = (productId: string): void => {
    Alert.alert(
      'Usuń produkt',
      'Czy na pewno chcesz usunąć ten produkt?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: () => {
            setProducts(prev => prev.filter(item => item.id !== productId));
          },
        },
      ],
    );
  };

  return (
    <ScreenLayout
      title="Products"
      subtitle="CRUD produktów z relacją do kategorii"
    >
      <SummaryCard title="Liczba rekordów" value={products.length} />

      <InfoBox text="Produkt posiada klucz obcy categoryId wskazujący na Category. Użytkownik wybiera kategorię podczas dodawania i edycji produktu, a na liście wyświetlana jest nazwa powiązanej kategorii." />

      {isAddingProduct ? (
        <ProductForm
          categories={categories}
          submitLabel="Dodaj produkt"
          onSubmit={handleAddProduct}
          onCancel={() => setIsAddingProduct(false)}
        />
      ) : null}

      {editingProduct ? (
        <ProductForm
          categories={categories}
          submitLabel="Zapisz zmiany"
          initialValues={{
            name: editingProduct.name,
            price: String(editingProduct.price),
            categoryId: editingProduct.categoryId,
          }}
          onSubmit={handleEditProduct}
          onCancel={() => setEditingProductId(null)}
        />
      ) : null}

      {products.map(product => (
        <EntityCard
          key={product.id}
          title={product.name}
          lines={[
            `Cena: ${product.price} PLN`,
            `Kategoria: ${getCategoryName(product.categoryId)}`,
            `categoryId: ${product.categoryId}`,
          ]}
          onEdit={() => setEditingProductId(product.id)}
          onDelete={() => handleDeleteProduct(product.id)}
        />
      ))}

      {!isAddingProduct && !editingProduct ? (
        <Pressable
          style={styles.primaryButton}
          onPress={() => setIsAddingProduct(true)}
        >
          <Text style={styles.primaryButtonText}>Dodaj nowy produkt</Text>
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

export default ProductsScreen;