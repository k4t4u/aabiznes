import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenLayout from '../components/ScreenLayout';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

const DetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { title, description } = route.params;

  return (
    <ScreenLayout
      title="Szczegóły"
      subtitle="Szczegóły - drugi widok aplikacji"
    >
      <View style={styles.card}>
        <Text style={styles.label}>Tytuł</Text>
        <Text style={styles.value}>{title}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Opis</Text>
        <Text style={styles.value}>{description}</Text>
      </View>

      <Pressable style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Wróć</Text>
      </Pressable>
    </ScreenLayout>
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
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7A90',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 18,
    lineHeight: 26,
    color: '#1B263B',
    fontWeight: '500',
  },
  button: {
    borderWidth: 1.5,
    borderColor: '#2E6BE6',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    color: '#2E6BE6',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default DetailsScreen;