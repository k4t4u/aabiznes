export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  categoryId: string;
};

export type Category = {
  id: string;
  name: string;
};

export type Order = {
  id: string;
  customerId: string;
  status: string;
  createdAt: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
};

export type Supplier = {
  id: string;
  name: string;
  phone: string;
};

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
};

export type Address = {
  id: string;
  city: string;
  street: string;
  postalCode: string;
};