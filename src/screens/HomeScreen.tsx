import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenLayout from '../components/ScreenLayout';
import { RootStackParamList, EntityType } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type ModuleItem = {
  label: string;
  entityType: EntityType;
};

const modules: ModuleItem[] = [
  { label: 'Customers', entityType: 'customers' },
  { label: 'Products', entityType: 'products' },
  { label: 'Categories', entityType: 'categories' },
  { label: 'Orders', entityType: 'orders' },
  { label: 'Order Items', entityType: 'orderItems' },
  { label: 'Suppliers', entityType: 'suppliers' },
  { label: 'Employees', entityType: 'employees' },
  { label: 'Addresses', entityType: 'addresses' },
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const openModule = (label: string, entityType: EntityType): void => {
    navigation.navigate('EntityList', {
      entityType,
      title: label,
    });
  };

  return (
    <ScreenLayout
      title="Order Management App"
      subtitle="Panel główny modułów"
    >
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>System zarządzania danymi</Text>
        <Text style={styles.infoText}>
          Aplikacja prezentuje moduły obsługujące operacje dodawania, edycji
          i usuwania dla wielu klas biznesowych.
        </Text>
      </View>

      <View style={styles.grid}>
        {modules.map(module => (
          <Pressable
            key={module.entityType}
            style={styles.tile}
            onPress={() => openModule(module.label, module.entityType)}
          >
            <Text style={styles.tileText}>{module.label}</Text>
          </Pressable>
        ))}
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#44546A',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  tile: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  tileText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A5F',
    textAlign: 'center',
  },
});

export default HomeScreen;