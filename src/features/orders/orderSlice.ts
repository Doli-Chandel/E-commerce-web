import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordersAPI } from '@/services/api';
import type { Order, OrderState, CartItem } from '@/types';

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk('orders/fetchAll', async () => {
  const response = await ordersAPI.getAll();
  return response;
});

export const fetchOrderById = createAsyncThunk('orders/fetchById', async (id: string) => {
  const response = await ordersAPI.getById(id);
  return response;
});

export const createOrder = createAsyncThunk(
  'orders/create',
  async ({ items, shippingInfo }: { items: CartItem[]; shippingInfo?: any }) => {
    const response = await ordersAPI.create(items, shippingInfo);
    return response;
  }
);

export const proceedOrder = createAsyncThunk('orders/proceed', async (id: string) => {
  const response = await ordersAPI.proceed(id);
  return response;
});

export const cancelOrder = createAsyncThunk('orders/cancel', async (id: string) => {
  const response = await ordersAPI.cancel(id);
  return response;
});

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(proceedOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  },
});

export default orderSlice.reducer;
