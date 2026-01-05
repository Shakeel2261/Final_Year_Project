import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "@/lib/services/api";
import { API_ENDPOINTS } from "@/lib/services/endpoints";

export interface Transaction {
  _id: string;
  customer:
    | string
    | { _id: string; name: string; phone: string; email: string };
  amount: number;
  type: "Cash" | "Credit";
  status: "Pending" | "Paid";
  order?: string | { _id: string };
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TransactionsState {
  items: Transaction[];
  receivables: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  items: [],
  receivables: [],
  loading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getAll<Transaction[]>(
        API_ENDPOINTS.TRANSACTIONS.LIST
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch transactions");
    }
  }
);

export const fetchReceivables = createAsyncThunk(
  "transactions/fetchReceivables",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getAll<Transaction[]>(
        API_ENDPOINTS.TRANSACTIONS.RECEIVABLES
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch receivables");
    }
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/create",
  async (data: Partial<Transaction>, { rejectWithValue }) => {
    try {
      const response = await apiService.create<Transaction>(
        API_ENDPOINTS.TRANSACTIONS.CREATE,
        data
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create transaction");
    }
  }
);

export const payReceivable = createAsyncThunk(
  "transactions/payReceivable",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.update<Transaction>(
        API_ENDPOINTS.TRANSACTIONS.PAY(id),
        {}
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to mark receivable as paid"
      );
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await apiService.delete(API_ENDPOINTS.TRANSACTIONS.LIST, id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete transaction");
    }
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchReceivables.fulfilled, (state, action) => {
        state.receivables = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(payReceivable.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.receivables = state.receivables.filter(
          (t) => t._id !== action.payload._id
        );
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
        state.receivables = state.receivables.filter(
          (t) => t._id !== action.payload
        );
      });
  },
});

export const { clearError } = transactionsSlice.actions;
export default transactionsSlice.reducer;
