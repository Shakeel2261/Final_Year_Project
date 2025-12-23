import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "@/lib/services/api";
import { API_ENDPOINTS } from "@/lib/services/endpoints";

interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
}

interface PaymentState {
  paymentIntent: PaymentIntent | null;
  loading: boolean;
  error: string | null;
  status: "idle" | "processing" | "succeeded" | "failed";
}

const initialState: PaymentState = {
  paymentIntent: null,
  loading: false,
  error: null,
  status: "idle",
};

export const createPaymentIntent = createAsyncThunk(
  "payment/createIntent",
  async (
    data: {
      amount: number;
      currency?: string;
      orderId?: string;
      customerId?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.create<{
        success: boolean;
        clientSecret: string;
        paymentIntentId: string;
      }>(API_ENDPOINTS.STRIPE.CREATE_PAYMENT_INTENT, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to create payment intent"
      );
    }
  }
);

export const confirmPayment = createAsyncThunk(
  "payment/confirm",
  async (paymentIntentId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.create<{
        success: boolean;
        paymentIntent: any;
      }>(API_ENDPOINTS.STRIPE.CONFIRM_PAYMENT, { paymentIntentId });
      return response.paymentIntent;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to confirm payment");
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPayment: (state) => {
      state.paymentIntent = null;
      state.status = "idle";
      state.error = null;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentIntent = {
          clientSecret: action.payload.clientSecret,
          paymentIntentId: action.payload.paymentIntentId,
        };
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(confirmPayment.pending, (state) => {
        state.loading = true;
        state.status = "processing";
        state.error = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.status =
          action.payload.status === "succeeded" ? "succeeded" : "failed";
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearPayment, setStatus, clearError } = paymentSlice.actions;
export default paymentSlice.reducer;
