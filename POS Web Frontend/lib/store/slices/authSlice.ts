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
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
