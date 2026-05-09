export type EntityType =
  | 'customers'
  | 'products'
  | 'categories'
  | 'orders'
  | 'orderItems'
  | 'suppliers'
  | 'employees'
  | 'addresses';

export type RootStackParamList = {
  Home: undefined;
  EntityList: {
    entityType: EntityType;
    title: string;
  };
  Details: {
    title: string;
    description: string;
  };
};