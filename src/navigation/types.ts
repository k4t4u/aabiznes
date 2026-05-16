export type SimpleEntityType =
  | 'suppliers'
  | 'employees'
  | 'addresses';

export type RootStackParamList = {
  Home: undefined;
  Products: undefined;
  Customers: undefined;
  Categories: undefined;
  Orders: undefined;
  OrderItems: undefined;
  SimpleList: {
    entityType: SimpleEntityType;
    title: string;
  };
};