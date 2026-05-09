import React, { useMemo, useState } from 'react';
import {
  Alert,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenLayout from '../components/ScreenLayout';
import ProductForm from '../components/ProductForm';
import CustomerForm from '../components/CustomerForm';
import CategoryForm from '../components/CategoryForm';
import SupplierForm from '../components/SupplierForm';
import EmployeeForm from '../components/EmployeeForm';
import AddressForm from '../components/AddressForm';
import OrderForm from '../components/OrderForm';
import OrderItemForm from '../components/OrderItemForm';
import SummaryCard from '../components/SummaryCard';
import EntityCard from '../components/EntityCard';
import InfoBox from '../components/InfoBox';
import {RootStackParamList} from '../navigation/types';
import {
  customers as initialCustomers,
  products as initialProducts,
  categories as initialCategories,
  orders as initialOrders,
  orderItems as initialOrderItems,
  suppliers as initialSuppliers,
  employees as initialEmployees,
  addresses as initialAddresses,
} from '../data/mockData';
import {
  Product,
  Customer,
  Category,
  Supplier,
  Employee,
  Address,
  Order,
  OrderItem,
} from '../models/models';

type Props = NativeStackScreenProps<RootStackParamList, 'EntityList'>;

type ProductFormValues = {
  name: string;
  price: string;
  categoryId: string;
};

type CustomerFormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

type CategoryFormValues = {
  name: string;
};

type SupplierFormValues = {
  name: string;
  phone: string;
};

type EmployeeFormValues = {
  firstName: string;
  lastName: string;
  role: string;
};

type AddressFormValues = {
  city: string;
  street: string;
  postalCode: string;
};

type OrderFormValues = {
  customerId: string;
  status: string;
  createdAt: string;
};

type OrderItemFormValues = {
  orderId: string;
  productId: string;
  quantity: string;
};

const EntityListScreen: React.FC<Props> = ({route}) => {
  const {title, entityType} = route.params;

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [orderItems, setOrderItems] = useState<OrderItem[]>(initialOrderItems);

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState<string | null>(null);

  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const [isAddingOrder, setIsAddingOrder] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  const [isAddingOrderItem, setIsAddingOrderItem] = useState(false);
  const [editingOrderItemId, setEditingOrderItemId] = useState<string | null>(null);

  const editingProduct = useMemo(
    () => products.find(item => item.id === editingProductId) ?? null,
    [products, editingProductId],
  );

  const editingCustomer = useMemo(
    () => customers.find(item => item.id === editingCustomerId) ?? null,
    [customers, editingCustomerId],
  );

  const editingCategory = useMemo(
    () => categories.find(item => item.id === editingCategoryId) ?? null,
    [categories, editingCategoryId],
  );

  const editingSupplier = useMemo(
    () => suppliers.find(item => item.id === editingSupplierId) ?? null,
    [suppliers, editingSupplierId],
  );

  const editingEmployee = useMemo(
    () => employees.find(item => item.id === editingEmployeeId) ?? null,
    [employees, editingEmployeeId],
  );

  const editingAddress = useMemo(
    () => addresses.find(item => item.id === editingAddressId) ?? null,
    [addresses, editingAddressId],
  );

  const editingOrder = useMemo(
    () => orders.find(item => item.id === editingOrderId) ?? null,
    [orders, editingOrderId],
  );

  const editingOrderItem = useMemo(
    () => orderItems.find(item => item.id === editingOrderItemId) ?? null,
    [orderItems, editingOrderItemId],
  );

  const handleAddProduct = (values: ProductFormValues): void => {
    const newProduct: Product = {
      id: `p${Date.now()}`,
      name: values.name,
      price: Number(values.price),
      categoryId: values.categoryId,
    };
    setProducts(prev => [...prev, newProduct]);
    setIsAddingProduct(false);
  };

  const handleEditProduct = (values: ProductFormValues): void => {
    if (!editingProductId) {
      return;
    }

    setProducts(prev =>
      prev.map(item =>
        item.id === editingProductId
          ? {
              ...item,
              name: values.name,
              price: Number(values.price),
              categoryId: values.categoryId,
            }
          : item,
      ),
    );
    setEditingProductId(null);
  };

  const handleDeleteProduct = (productId: string): void => {
    Alert.alert('Usuń produkt', 'Czy na pewno chcesz usunąć ten produkt?', [
      {text: 'Anuluj', style: 'cancel'},
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: () =>
          setProducts(prev => prev.filter(item => item.id !== productId)),
      },
    ]);
  };

  const handleAddCustomer = (values: CustomerFormValues): void => {
    const newCustomer: Customer = {
      id: `c${Date.now()}`,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
    };
    setCustomers(prev => [...prev, newCustomer]);
    setIsAddingCustomer(false);
  };

  const handleEditCustomer = (values: CustomerFormValues): void => {
    if (!editingCustomerId) {
      return;
    }

    setCustomers(prev =>
      prev.map(item =>
        item.id === editingCustomerId
          ? {
              ...item,
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
            }
          : item,
      ),
    );
    setEditingCustomerId(null);
  };

  const handleDeleteCustomer = (customerId: string): void => {
    Alert.alert('Usuń klienta', 'Czy na pewno chcesz usunąć tego klienta?', [
      {text: 'Anuluj', style: 'cancel'},
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: () =>
          setCustomers(prev => prev.filter(item => item.id !== customerId)),
      },
    ]);
  };

  const handleAddCategory = (values: CategoryFormValues): void => {
    const newCategory: Category = {
      id: `cat${Date.now()}`,
      name: values.name,
    };
    setCategories(prev => [...prev, newCategory]);
    setIsAddingCategory(false);
  };

  const handleEditCategory = (values: CategoryFormValues): void => {
    if (!editingCategoryId) {
      return;
    }

    setCategories(prev =>
      prev.map(item =>
        item.id === editingCategoryId
          ? {
              ...item,
              name: values.name,
            }
          : item,
      ),
    );
    setEditingCategoryId(null);
  };

  const handleDeleteCategory = (categoryId: string): void => {
    Alert.alert('Usuń kategorię', 'Czy na pewno chcesz usunąć tę kategorię?', [
      {text: 'Anuluj', style: 'cancel'},
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: () =>
          setCategories(prev => prev.filter(item => item.id !== categoryId)),
      },
    ]);
  };

  const handleAddSupplier = (values: SupplierFormValues): void => {
    const newSupplier: Supplier = {
      id: `s${Date.now()}`,
      name: values.name,
      phone: values.phone,
    };
    setSuppliers(prev => [...prev, newSupplier]);
    setIsAddingSupplier(false);
  };

  const handleEditSupplier = (values: SupplierFormValues): void => {
    if (!editingSupplierId) {
      return;
    }

    setSuppliers(prev =>
      prev.map(item =>
        item.id === editingSupplierId
          ? {
              ...item,
              name: values.name,
              phone: values.phone,
            }
          : item,
      ),
    );
    setEditingSupplierId(null);
  };

  const handleDeleteSupplier = (supplierId: string): void => {
    Alert.alert('Usuń dostawcę', 'Czy na pewno chcesz usunąć tego dostawcę?', [
      {text: 'Anuluj', style: 'cancel'},
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: () =>
          setSuppliers(prev => prev.filter(item => item.id !== supplierId)),
      },
    ]);
  };

  const handleAddEmployee = (values: EmployeeFormValues): void => {
    const newEmployee: Employee = {
      id: `e${Date.now()}`,
      firstName: values.firstName,
      lastName: values.lastName,
      role: values.role,
    };
    setEmployees(prev => [...prev, newEmployee]);
    setIsAddingEmployee(false);
  };

  const handleEditEmployee = (values: EmployeeFormValues): void => {
    if (!editingEmployeeId) {
      return;
    }

    setEmployees(prev =>
      prev.map(item =>
        item.id === editingEmployeeId
          ? {
              ...item,
              firstName: values.firstName,
              lastName: values.lastName,
              role: values.role,
            }
          : item,
      ),
    );
    setEditingEmployeeId(null);
  };

  const handleDeleteEmployee = (employeeId: string): void => {
    Alert.alert('Usuń pracownika', 'Czy na pewno chcesz usunąć tego pracownika?', [
      {text: 'Anuluj', style: 'cancel'},
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: () =>
          setEmployees(prev => prev.filter(item => item.id !== employeeId)),
      },
    ]);
  };

  const handleAddAddress = (values: AddressFormValues): void => {
    const newAddress: Address = {
      id: `a${Date.now()}`,
      city: values.city,
      street: values.street,
      postalCode: values.postalCode,
    };
    setAddresses(prev => [...prev, newAddress]);
    setIsAddingAddress(false);
  };

  const handleEditAddress = (values: AddressFormValues): void => {
    if (!editingAddressId) {
      return;
    }

    setAddresses(prev =>
      prev.map(item =>
        item.id === editingAddressId
          ? {
              ...item,
              city: values.city,
              street: values.street,
              postalCode: values.postalCode,
            }
          : item,
      ),
    );
    setEditingAddressId(null);
  };

  const handleDeleteAddress = (addressId: string): void => {
    Alert.alert('Usuń adres', 'Czy na pewno chcesz usunąć ten adres?', [
      {text: 'Anuluj', style: 'cancel'},
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: () =>
          setAddresses(prev => prev.filter(item => item.id !== addressId)),
      },
    ]);
  };

  const handleAddOrder = (values: OrderFormValues): void => {
    const newOrder: Order = {
      id: `o${Date.now()}`,
      customerId: values.customerId,
      status: values.status,
      createdAt: values.createdAt,
    };
    setOrders(prev => [...prev, newOrder]);
    setIsAddingOrder(false);
  };

  const handleEditOrder = (values: OrderFormValues): void => {
    if (!editingOrderId) {
      return;
    }

    setOrders(prev =>
      prev.map(item =>
        item.id === editingOrderId
          ? {
              ...item,
              customerId: values.customerId,
              status: values.status,
              createdAt: values.createdAt,
            }
          : item,
      ),
    );
    setEditingOrderId(null);
  };

  const handleDeleteOrder = (orderId: string): void => {
    Alert.alert('Usuń zamówienie', 'Czy na pewno chcesz usunąć to zamówienie?', [
      {text: 'Anuluj', style: 'cancel'},
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: () =>
          setOrders(prev => prev.filter(item => item.id !== orderId)),
      },
    ]);
  };

  const handleAddOrderItem = (values: OrderItemFormValues): void => {
    const newOrderItem: OrderItem = {
      id: `oi${Date.now()}`,
      orderId: values.orderId,
      productId: values.productId,
      quantity: Number(values.quantity),
    };
    setOrderItems(prev => [...prev, newOrderItem]);
    setIsAddingOrderItem(false);
  };

  const handleEditOrderItem = (values: OrderItemFormValues): void => {
    if (!editingOrderItemId) {
      return;
    }

    setOrderItems(prev =>
      prev.map(item =>
        item.id === editingOrderItemId
          ? {
              ...item,
              orderId: values.orderId,
              productId: values.productId,
              quantity: Number(values.quantity),
            }
          : item,
      ),
    );
    setEditingOrderItemId(null);
  };

  const handleDeleteOrderItem = (orderItemId: string): void => {
    Alert.alert(
      'Usuń pozycję zamówienia',
      'Czy na pewno chcesz usunąć tę pozycję zamówienia?',
      [
        {text: 'Anuluj', style: 'cancel'},
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: () =>
            setOrderItems(prev => prev.filter(item => item.id !== orderItemId)),
        },
      ],
    );
  };

  const renderProducts = (): React.ReactNode => (
    <>
      <SummaryCard title="Liczba rekordów" value={products.length} />

      {isAddingProduct ? (
        <ProductForm
          submitLabel="Dodaj produkt"
          onSubmit={handleAddProduct}
          onCancel={() => setIsAddingProduct(false)}
        />
      ) : null}

      {editingProduct ? (
        <ProductForm
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
            `Kategoria: ${product.categoryId}`,
          ]}
          onEdit={() => setEditingProductId(product.id)}
          onDelete={() => handleDeleteProduct(product.id)}
        />
      ))}

      {!isAddingProduct && !editingProduct ? (
        <Pressable
          style={styles.primaryButton}
          onPress={() => setIsAddingProduct(true)}>
          <Text style={styles.primaryButtonText}>Dodaj nowy produkt</Text>
        </Pressable>
      ) : null}
    </>
  );

  const renderCustomers = (): React.ReactNode => (
    <>
      <SummaryCard title="Liczba rekordów" value={customers.length} />

      {isAddingCustomer ? (
        <CustomerForm
          submitLabel="Dodaj klienta"
          onSubmit={handleAddCustomer}
          onCancel={() => setIsAddingCustomer(false)}
        />
      ) : null}

      {editingCustomer ? (
        <CustomerForm
          submitLabel="Zapisz zmiany"
          initialValues={{
            firstName: editingCustomer.firstName,
            lastName: editingCustomer.lastName,
            email: editingCustomer.email,
          }}
          onSubmit={handleEditCustomer}
          onCancel={() => setEditingCustomerId(null)}
        />
      ) : null}

      {customers.map(customer => (
        <EntityCard
          key={customer.id}
          title={`${customer.firstName} ${customer.lastName}`}
          lines={[`E-mail: ${customer.email}`]}
          onEdit={() => setEditingCustomerId(customer.id)}
          onDelete={() => handleDeleteCustomer(customer.id)}
        />
      ))}

      {!isAddingCustomer && !editingCustomer ? (
        <Pressable
          style={styles.primaryButton}
          onPress={() => setIsAddingCustomer(true)}>
          <Text style={styles.primaryButtonText}>Dodaj nowego klienta</Text>
        </Pressable>
      ) : null}
    </>
  );

  const renderCategories = (): React.ReactNode => (
    <>
      <SummaryCard title="Liczba rekordów" value={categories.length} />

      {isAddingCategory ? (
        <CategoryForm
          submitLabel="Dodaj kategorię"
          onSubmit={handleAddCategory}
          onCancel={() => setIsAddingCategory(false)}
        />
      ) : null}

      {editingCategory ? (
        <CategoryForm
          submitLabel="Zapisz zmiany"
          initialValues={{name: editingCategory.name}}
          onSubmit={handleEditCategory}
          onCancel={() => setEditingCategoryId(null)}
        />
      ) : null}

      {categories.map(category => (
        <EntityCard
          key={category.id}
          title={category.name}
          lines={[`ID: ${category.id}`]}
          onEdit={() => setEditingCategoryId(category.id)}
          onDelete={() => handleDeleteCategory(category.id)}
        />
      ))}

      {!isAddingCategory && !editingCategory ? (
        <Pressable
          style={styles.primaryButton}
          onPress={() => setIsAddingCategory(true)}>
          <Text style={styles.primaryButtonText}>Dodaj nową kategorię</Text>
        </Pressable>
      ) : null}
    </>
  );

  const renderSuppliers = (): React.ReactNode => (
    <>
      <SummaryCard title="Liczba rekordów" value={suppliers.length} />

      {isAddingSupplier ? (
        <SupplierForm
          submitLabel="Dodaj dostawcę"
          onSubmit={handleAddSupplier}
          onCancel={() => setIsAddingSupplier(false)}
        />
      ) : null}

      {editingSupplier ? (
        <SupplierForm
          submitLabel="Zapisz zmiany"
          initialValues={{
            name: editingSupplier.name,
            phone: editingSupplier.phone,
          }}
          onSubmit={handleEditSupplier}
          onCancel={() => setEditingSupplierId(null)}
        />
      ) : null}

      {suppliers.map(supplier => (
        <EntityCard
          key={supplier.id}
          title={supplier.name}
          lines={[`Telefon: ${supplier.phone}`]}
          onEdit={() => setEditingSupplierId(supplier.id)}
          onDelete={() => handleDeleteSupplier(supplier.id)}
        />
      ))}

      {!isAddingSupplier && !editingSupplier ? (
        <Pressable
          style={styles.primaryButton}
          onPress={() => setIsAddingSupplier(true)}>
          <Text style={styles.primaryButtonText}>Dodaj nowego dostawcę</Text>
        </Pressable>
      ) : null}
    </>
  );

  const renderEmployees = (): React.ReactNode => (
    <>
      <SummaryCard title="Liczba rekordów" value={employees.length} />

      {isAddingEmployee ? (
        <EmployeeForm
          submitLabel="Dodaj pracownika"
          onSubmit={handleAddEmployee}
          onCancel={() => setIsAddingEmployee(false)}
        />
      ) : null}

      {editingEmployee ? (
        <EmployeeForm
          submitLabel="Zapisz zmiany"
          initialValues={{
            firstName: editingEmployee.firstName,
            lastName: editingEmployee.lastName,
            role: editingEmployee.role,
          }}
          onSubmit={handleEditEmployee}
          onCancel={() => setEditingEmployeeId(null)}
        />
      ) : null}

      {employees.map(employee => (
        <EntityCard
          key={employee.id}
          title={`${employee.firstName} ${employee.lastName}`}
          lines={[`Stanowisko: ${employee.role}`]}
          onEdit={() => setEditingEmployeeId(employee.id)}
          onDelete={() => handleDeleteEmployee(employee.id)}
        />
      ))}

      {!isAddingEmployee && !editingEmployee ? (
        <Pressable
          style={styles.primaryButton}
          onPress={() => setIsAddingEmployee(true)}>
          <Text style={styles.primaryButtonText}>Dodaj nowego pracownika</Text>
        </Pressable>
      ) : null}
    </>
  );

  const renderAddresses = (): React.ReactNode => (
    <>
      <SummaryCard title="Liczba rekordów" value={addresses.length} />

      {isAddingAddress ? (
        <AddressForm
          submitLabel="Dodaj adres"
          onSubmit={handleAddAddress}
          onCancel={() => setIsAddingAddress(false)}
        />
      ) : null}

      {editingAddress ? (
        <AddressForm
          submitLabel="Zapisz zmiany"
          initialValues={{
            city: editingAddress.city,
            street: editingAddress.street,
            postalCode: editingAddress.postalCode,
          }}
          onSubmit={handleEditAddress}
          onCancel={() => setEditingAddressId(null)}
        />
      ) : null}

      {addresses.map(address => (
        <EntityCard
          key={address.id}
          title={address.city}
          lines={[
            `Ulica: ${address.street}`,
            `Kod: ${address.postalCode}`,
          ]}
          onEdit={() => setEditingAddressId(address.id)}
          onDelete={() => handleDeleteAddress(address.id)}
        />
      ))}

      {!isAddingAddress && !editingAddress ? (
        <Pressable
          style={styles.primaryButton}
          onPress={() => setIsAddingAddress(true)}>
          <Text style={styles.primaryButtonText}>Dodaj nowy adres</Text>
        </Pressable>
      ) : null}
    </>
  );

  const renderOrders = (): React.ReactNode => (
    <>
      <SummaryCard title="Liczba rekordów" value={orders.length} />

      {isAddingOrder ? (
        <OrderForm
          submitLabel="Dodaj zamówienie"
          onSubmit={handleAddOrder}
          onCancel={() => setIsAddingOrder(false)}
        />
      ) : null}

      {editingOrder ? (
        <OrderForm
          submitLabel="Zapisz zmiany"
          initialValues={{
            customerId: editingOrder.customerId,
            status: editingOrder.status,
            createdAt: editingOrder.createdAt,
          }}
          onSubmit={handleEditOrder}
          onCancel={() => setEditingOrderId(null)}
        />
      ) : null}

      {orders.map(order => (
        <EntityCard
          key={order.id}
          title={`Zamówienie ${order.id}`}
          lines={[
            `Customer ID: ${order.customerId}`,
            `Status: ${order.status}`,
            `Data: ${order.createdAt}`,
          ]}
          onEdit={() => setEditingOrderId(order.id)}
          onDelete={() => handleDeleteOrder(order.id)}
        />
      ))}

      {!isAddingOrder && !editingOrder ? (
        <Pressable
          style={styles.primaryButton}
          onPress={() => setIsAddingOrder(true)}>
          <Text style={styles.primaryButtonText}>Dodaj nowe zamówienie</Text>
        </Pressable>
      ) : null}
    </>
  );

  const renderOrderItems = (): React.ReactNode => (
    <>
      <SummaryCard title="Liczba rekordów" value={orderItems.length} />

      {isAddingOrderItem ? (
        <OrderItemForm
          submitLabel="Dodaj pozycję"
          onSubmit={handleAddOrderItem}
          onCancel={() => setIsAddingOrderItem(false)}
        />
      ) : null}

      {editingOrderItem ? (
        <OrderItemForm
          submitLabel="Zapisz zmiany"
          initialValues={{
            orderId: editingOrderItem.orderId,
            productId: editingOrderItem.productId,
            quantity: String(editingOrderItem.quantity),
          }}
          onSubmit={handleEditOrderItem}
          onCancel={() => setEditingOrderItemId(null)}
        />
      ) : null}

      {orderItems.map(orderItem => (
        <EntityCard
          key={orderItem.id}
          title={`Pozycja ${orderItem.id}`}
          lines={[
            `Order ID: ${orderItem.orderId}`,
            `Product ID: ${orderItem.productId}`,
            `Ilość: ${orderItem.quantity}`,
          ]}
          onEdit={() => setEditingOrderItemId(orderItem.id)}
          onDelete={() => handleDeleteOrderItem(orderItem.id)}
        />
      ))}

      {!isAddingOrderItem && !editingOrderItem ? (
        <Pressable
          style={styles.primaryButton}
          onPress={() => setIsAddingOrderItem(true)}>
          <Text style={styles.primaryButtonText}>Dodaj nową pozycję</Text>
        </Pressable>
      ) : null}
    </>
  );

  if (entityType === 'products') {
    return (
      <ScreenLayout title={title} subtitle="CRUD produktów">
        {renderProducts()}
      </ScreenLayout>
    );
  }

  if (entityType === 'customers') {
    return (
      <ScreenLayout title={title} subtitle="CRUD klientów">
        {renderCustomers()}
      </ScreenLayout>
    );
  }

  if (entityType === 'categories') {
    return (
      <ScreenLayout title={title} subtitle="CRUD kategorii">
        {renderCategories()}
      </ScreenLayout>
    );
  }

  if (entityType === 'suppliers') {
    return (
      <ScreenLayout title={title} subtitle="CRUD dostawców">
        {renderSuppliers()}
      </ScreenLayout>
    );
  }

  if (entityType === 'employees') {
    return (
      <ScreenLayout title={title} subtitle="CRUD pracowników">
        {renderEmployees()}
      </ScreenLayout>
    );
  }

  if (entityType === 'addresses') {
    return (
      <ScreenLayout title={title} subtitle="CRUD adresów">
        {renderAddresses()}
      </ScreenLayout>
    );
  }

  if (entityType === 'orders') {
    return (
      <ScreenLayout title={title} subtitle="CRUD zamówień">
        {renderOrders()}
      </ScreenLayout>
    );
  }

  if (entityType === 'orderItems') {
    return (
      <ScreenLayout title={title} subtitle="CRUD pozycji zamówień">
        {renderOrderItems()}
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title={title} subtitle={`Lista encji: ${entityType}`}>
      <SummaryCard title="Liczba rekordów" value={0} />
      <InfoBox text="Brak danych dla wybranego modułu." />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
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

export default EntityListScreen;