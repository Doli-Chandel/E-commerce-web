export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  purchasePrice: number;
  salePrice: number;
  margin: number;
  stock: number;
  isVisible: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  status: 'PENDING' | 'PROCEEDED' | 'CANCELLED';
  totalAmount: number;
  orderItems: OrderItem[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}
