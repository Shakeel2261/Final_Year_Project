import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "@/lib/services/api";
import { API_ENDPOINTS } from "@/lib/services/endpoints";

export interface OrderItem {
  productId:
    | string
    | { _id: string; productName: string; productCode: string; price: number };
  quantity: number;
  finalPrice?: number;
}

export interface Order {
  _id: string;
  customer?:
    | string
    | { _id: string; name: string; phone: string; email: string };
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdBy?:
    | string
    | { _id: string; name: string; email: string; role: string };
  createdAt?: string;
  updatedAt?: string;
}

interface OrdersState {
  items: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  count?: number;
}

const initialState: OrdersState = {
  items: [],
  selectedOrder: null,
  loading: false,
  error: null,
  count: 0,
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

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async (
    { id, status }: { id: string; status: Order["status"] },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.update<{
        success: boolean;
        message: string;
        order: Order;
      }>(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), { status });
      return response.order;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update order status");
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await apiService.delete(API_ENDPOINTS.ORDERS.LIST, id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete order");
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
        state.count = action.payload.count;
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
      .addCase(createOrder.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.count = (state.count || 0) + 1;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (o) => o._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.items = state.items.filter((o) => o._id !== action.payload);
        state.count = (state.count || 0) - 1;
      });
  },
});

export const { clearError } = ordersSlice.actions;
export default ordersSlice.reducer;
