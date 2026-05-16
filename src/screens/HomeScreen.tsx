import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenLayout from '../components/ScreenLayout';
import { RootStackParamList, SimpleEntityType } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type ModuleItem =
  | { label: string; screen: 'Products' | 'Customers' | 'Categories' | 'Orders' | 'OrderItems' }
  | { label: string; screen: 'SimpleList'; entityType: SimpleEntityType };

const modules: ModuleItem[] = [
  { label: 'Customers', screen: 'Customers' },
  { label: 'Products', screen: 'Products' },
  { label: 'Categories', screen: 'Categories' },
  { label: 'Orders', screen: 'Orders' },
  { label: 'Order Items', screen: 'OrderItems' },
  { label: 'Suppliers', screen: 'SimpleList', entityType: 'suppliers' },
  { label: 'Employees', screen: 'SimpleList', entityType: 'employees' },
  { label: 'Addresses', screen: 'SimpleList', entityType: 'addresses' },
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const openModule = (module: ModuleItem): void => {
    if (module.screen === 'SimpleList') {
      navigation.navigate('SimpleList', {
        entityType: module.entityType,
        title: module.label,
      });
      return;
    }

    navigation.navigate(module.screen);
  };

  return (
    <ScreenLayout
      title="Order Management App"
      subtitle="Panel główny modułów"
    >
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>System zarządzania danymi</Text>
        <Text style={styles.infoText}>
          Aplikacja została podzielona na osobne moduły CRUD oraz listy pomocnicze.
          Dzięki temu kod jest czytelniejszy, łatwiejszy w utrzymaniu i bardziej spójny
          z podejściem projektowym z zajęć.
        </Text>
      </View>

      <View style={styles.grid}>
        {modules.map(module => (
          <Pressable
            key={module.label}
            style={styles.tile}
            onPress={() => openModule(module)}
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