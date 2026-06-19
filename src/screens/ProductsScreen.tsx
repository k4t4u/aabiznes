import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  ProductDto,
} from '../api/productsApi';
import {
  getCategories,
  CategoryDto,
} from '../api/categoriesApi';

type ProductFormValues = {
  name: string;
  price: string;
  categoryId: string;
};

const ProductsScreen: React.FC = () => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const editingProduct = useMemo(
    () => products.find(item => item.id === editingProductId) ?? null,
    [products, editingProductId],
  );

  const loadData = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się pobrać produktów lub kategorii.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddProduct = async (values: ProductFormValues): Promise<void> => {
    try {
      const created = await createProduct({
        name: values.name,
        price: Number(values.price),
        categoryId: values.categoryId,
      });

      setProducts(prev => [...prev, created]);
      setIsAddingProduct(false);
    } catch (error: any) {
      Alert.alert('Błąd', error?.message || 'Nie udało się utworzyć produktu.');
    }
  };

  const handleEditProduct = async (values: ProductFormValues): Promise<void> => {
    if (!editingProductId) {
      return;
    }

    try {
      const updated = await updateProduct(editingProductId, {
        name: values.name,
        price: Number(values.price),
        categoryId: values.categoryId,
      });

      setProducts(prev =>
        prev.map(item => (item.id === editingProductId ? updated : item)),
      );

      setEditingProductId(null);
    } catch (error: any) {
      Alert.alert(
        'Błąd',
        error?.message || 'Nie udało się zaktualizować produktu.',
      );
    }
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
          onPress: async () => {
            try {
              await deleteProduct(productId);
              setProducts(prev => prev.filter(item => item.id !== productId));
            } catch (error: any) {
              Alert.alert(
                'Błąd',
                error?.message || 'Nie udało się usunąć produktu.',
              );
            }
          },
        },
      ],
    );
  };

  return (
    <ScreenLayout
      title="Products"
      subtitle="CRUD produktów z API i relacją do kategorii"
    >
      <SummaryCard title="Liczba rekordów" value={products.length} />

      <InfoBox text="Ten ekran korzysta z backendu API. Produkty i kategorie są pobierane z serwera, a relacja Product -> Category działa przez prawdziwy klucz obcy." />

      {isLoading ? <Text style={styles.statusText}>Ładowanie danych...</Text> : null}

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
            `Kategoria: ${product.categoryName}`,
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

export default ProductsScreen;