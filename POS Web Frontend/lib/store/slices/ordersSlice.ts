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
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  loading: false,
  error: null,
};

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
