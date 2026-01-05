import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "@/lib/services/api";
import { API_ENDPOINTS } from "@/lib/services/endpoints";
import { setAuthToken, removeAuthToken } from "@/lib/config/api";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthState {
  customer: Customer | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  customer: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const customerLogin = createAsyncThunk(
  "auth/customerLogin",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.create<{
        message: string;
        customer: Customer;
        token: string;
      }>(API_ENDPOINTS.CUSTOMER_AUTH.LOGIN, credentials);

      setAuthToken(response.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const customerForgotPassword = createAsyncThunk(
  "auth/customerForgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await apiService.create<{
        success: boolean;
        message: string;
      }>(API_ENDPOINTS.CUSTOMER_AUTH.FORGOT_PASSWORD, { email });
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to send password reset email"
      );
    }
  }
);

export const customerResetPassword = createAsyncThunk(
  "auth/customerResetPassword",
  async (
    { token, password }: { token: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.create<{
        success: boolean;
        message: string;
      }>(API_ENDPOINTS.CUSTOMER_AUTH.RESET_PASSWORD(token), { password });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to reset password");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.customer = null;
      state.token = null;
      state.isAuthenticated = false;
      removeAuthToken();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(customerLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(customerLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload.customer;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(customerLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(customerForgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(customerForgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(customerForgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(customerResetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(customerResetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(customerResetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
