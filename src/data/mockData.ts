import {
  Customer,
  Product,
  Category,
  Order,
  OrderItem,
  Supplier,
  Employee,
  Address,
} from '../models/models';

export const customers: Customer[] = [
  {
    id: 'c1',
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@example.com',
  },
  {
    id: 'c2',
    firstName: 'Anna',
    lastName: 'Nowak',
    email: 'anna.nowak@example.com',
  },
];

export const categories: Category[] = [
  {
    id: 'cat1',
    name: 'Elektronika',
  },
  {
    id: 'cat2',
    name: 'Biuro',
  },
];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Laptop Dell',
    price: 4200,
    categoryId: 'cat1',
  },
  {
    id: 'p2',
    name: 'Monitor LG',
    price: 1200,
    categoryId: 'cat1',
  },
  {
    id: 'p3',
    name: 'Drukarka HP',
    price: 800,
    categoryId: 'cat2',
  },
];

export const orders: Order[] = [
  {
    id: 'o1',
    customerId: 'c1',
    status: 'Nowe',
    createdAt: '2026-02-01',
  },
  {
    id: 'o2',
    customerId: 'c2',
    status: 'Zrealizowane',
    createdAt: '2026-02-02',
  },
];

export const orderItems: OrderItem[] = [
  {
    id: 'oi1',
    orderId: 'o1',
    productId: 'p1',
    quantity: 1,
  },
  {
    id: 'oi2',
    orderId: 'o1',
    productId: 'p2',
    quantity: 2,
  },
];

export const suppliers: Supplier[] = [
  {
    id: 's1',
    name: 'Tech Supplier',
    phone: '123456789',
  },
  {
    id: 's2',
    name: 'Office Goods',
    phone: '987654321',
  },
];

export const employees: Employee[] = [
  {
    id: 'e1',
    firstName: 'Piotr',
    lastName: 'Zielony',
    role: 'Manager',
  },
  {
    id: 'e2',
    firstName: 'Karolina',
    lastName: 'Czerwona',
    role: 'Sales Specialist',
  },
];

export const addresses: Address[] = [
  {
    id: 'a1',
    city: 'Warszawa',
    street: 'Marszałkowska 10',
    postalCode: '00-001',
  },
  {
    id: 'a2',
    city: 'Kraków',
    street: 'Długa 15',
    postalCode: '30-002',
  },
];