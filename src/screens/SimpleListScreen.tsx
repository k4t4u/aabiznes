import React from 'react';
import ScreenLayout from '../components/ScreenLayout';
import SummaryCard from '../components/SummaryCard';
import EntityCard from '../components/EntityCard';
import InfoBox from '../components/InfoBox';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import {
  suppliers,
  employees,
  addresses,
} from '../data/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'SimpleList'>;

const SimpleListScreen: React.FC<Props> = ({ route }) => {
  const { title, entityType } = route.params;

  const renderContent = (): React.ReactNode => {
    switch (entityType) {
      case 'suppliers':
        return (
          <>
            <SummaryCard title="Liczba rekordów" value={suppliers.length} />
            {suppliers.map(supplier => (
              <EntityCard
                key={supplier.id}
                title={supplier.name}
                lines={[
                  `Telefon: ${supplier.phone}`,
                  `ID: ${supplier.id}`,
                ]}
              />
            ))}
          </>
        );

      case 'employees':
        return (
          <>
            <SummaryCard title="Liczba rekordów" value={employees.length} />
            {employees.map(employee => (
              <EntityCard
                key={employee.id}
                title={`${employee.firstName} ${employee.lastName}`}
                lines={[
                  `Stanowisko: ${employee.role}`,
                  `ID: ${employee.id}`,
                ]}
              />
            ))}
          </>
        );

      case 'addresses':
        return (
          <>
            <SummaryCard title="Liczba rekordów" value={addresses.length} />
            {addresses.map(address => (
              <EntityCard
                key={address.id}
                title={`${address.city}, ${address.street}`}
                lines={[
                  `Kod pocztowy: ${address.postalCode}`,
                  `ID: ${address.id}`,
                ]}
              />
            ))}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <ScreenLayout
      title={title}
      subtitle="Prosta lista encji"
    >
      {renderContent()}

      <InfoBox text="Ten ekran obsługuje prostsze moduły listowe. Dla bardziej rozbudowanych encji, takich jak Products, Customers, Categories, Orders i Order Items, używamy osobnych ekranów CRUD." />
    </ScreenLayout>
  );
};

export default SimpleListScreen;