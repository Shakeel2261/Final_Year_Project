import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "@/lib/services/api";
import { API_ENDPOINTS } from "@/lib/services/endpoints";

export interface Order {
  _id: string;
  customer?: string;
  items: Array<{
    productId: string;
    quantity: number;
    finalPrice?: number;
  }>;
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt?: string;
}

interface OrdersState {
  items: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getAll<{
        success: boolean;
        count: number;
        orders: Order[];
      }>(API_ENDPOINTS.ORDERS.LIST);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch orders");
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getById<{
        success: boolean;
        order: Order;
      }>(API_ENDPOINTS.ORDERS.LIST, id);
      return response.order;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch order");
    }
  }
);

export const createOrder = createAsyncThunk(
  "orders/create",
  async (data: Partial<Order>, { rejectWithValue }) => {
    try {
      const response = await apiService.create<{
        success: boolean;
        message: string;
        order: Order;
      }>(API_ENDPOINTS.ORDERS.CREATE, data);
      return response.order;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create order");
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.orders || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = ordersSlice.actions;
export default ordersSlice.reducer;
