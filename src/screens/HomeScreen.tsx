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

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const goToDetails = (): void => {
    navigation.navigate('Details', {
      title: 'Szczegóły - drugi widok aplikacji',
      description:
        'To jest przykładowy ekran szczegółów. Dane zostały przekazane z pierwszego widoku przy pomocy nawigacji.',
    });
  };

  return (
    <ScreenLayout
      title="JP - Moja aplikacja"
      subtitle="Laby 1 layout + 2 widoki"
    >
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Widok główny</Text>
        <Text style={styles.cardText}>
          To jest pierwszy ekran aplikacji. Zawiera przykładowy opis oraz
          przycisk przejścia do drugiego widoku.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Laboratoria 1. Cel zadania</Text>
        <Text style={styles.cardText}>
          Zaprojektuj Layout aplikacji (Layout + 2 widoki) - zadanie będzie sprawdzane na pierwszym laboratorium.
        </Text>
      </View>

      <Pressable style={styles.button} onPress={goToDetails}>
        <Text style={styles.buttonText}>Przejdź do drugiego widoku</Text>
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
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#44546A',
  },
  button: {
    backgroundColor: '#2E6BE6',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default HomeScreen;