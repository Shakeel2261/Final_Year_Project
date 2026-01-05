import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "@/lib/services/api";
import { API_ENDPOINTS } from "@/lib/services/endpoints";

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CustomersState {
  items: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  items: [],
  selectedCustomer: null,
  loading: false,
  error: null,
};

export const fetchCustomers = createAsyncThunk(
  "customers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getAll<Customer[]>(
        API_ENDPOINTS.CUSTOMERS.LIST
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch customers");
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  "customers/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getById<Customer>(
        API_ENDPOINTS.CUSTOMERS.LIST,
        id
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch customer");
    }
  }
);

export const createCustomer = createAsyncThunk(
  "customers/create",
  async (data: Partial<Customer>, { rejectWithValue }) => {
    try {
      const response = await apiService.create<Customer>(
        API_ENDPOINTS.CUSTOMERS.CREATE,
        data
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create customer");
    }
  }
);

export const updateCustomer = createAsyncThunk(
  "customers/update",
  async (
    { id, data }: { id: string; data: Partial<Customer> },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.update<Customer>(
        API_ENDPOINTS.CUSTOMERS.LIST,
        id,
        data
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update customer");
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  "customers/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await apiService.delete(API_ENDPOINTS.CUSTOMERS.LIST, id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete customer");
    }
  }
);

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCustomer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload);
      });
  },
});

export const { clearError } = customersSlice.actions;
export default customersSlice.reducer;
