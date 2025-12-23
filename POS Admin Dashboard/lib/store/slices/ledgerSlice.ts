import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "@/lib/services/api";
import { API_ENDPOINTS } from "@/lib/services/endpoints";

export interface LedgerEntry {
  _id: string;
  entryType: string;
  debitAmount: number;
  creditAmount: number;
  accountType: string;
  accountName: string;
  description: string;
  referenceNumber?: string;
  transactionDate: string;
  status: "ACTIVE" | "CANCELLED" | "ADJUSTED";
  createdAt?: string;
  updatedAt?: string;
}

interface LedgerState {
  entries: LedgerEntry[];
  accountBalance: any;
  trialBalance: any;
  profitLoss: any;
  balanceSheet: any;
  loading: boolean;
  error: string | null;
  totalRecords?: number;
}

const initialState: LedgerState = {
  entries: [],
  accountBalance: null,
  trialBalance: null,
  profitLoss: null,
  balanceSheet: null,
  loading: false,
  error: null,
  totalRecords: 0,
};

export const fetchLedgerEntries = createAsyncThunk(
  "ledger/fetchAll",
  async (params?: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await apiService.getAll<{
        success: boolean;
        totalRecords: number;
        data: LedgerEntry[];
      }>(API_ENDPOINTS.LEDGER.LIST, params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch ledger entries");
    }
  }
);

export const fetchTrialBalance = createAsyncThunk(
  "ledger/fetchTrialBalance",
  async (params?: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await apiService.getAll(
        API_ENDPOINTS.LEDGER.TRIAL_BALANCE,
        params
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch trial balance");
    }
  }
);

export const fetchAccountBalance = createAsyncThunk(
  "ledger/fetchAccountBalance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getAll(
        API_ENDPOINTS.LEDGER.ACCOUNT_BALANCE
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch account balance"
      );
    }
  }
);

export const fetchProfitLoss = createAsyncThunk(
  "ledger/fetchProfitLoss",
  async (params?: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await apiService.getAll(
        API_ENDPOINTS.LEDGER.PROFIT_LOSS,
        params
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch profit & loss");
    }
  }
);

export const fetchBalanceSheet = createAsyncThunk(
  "ledger/fetchBalanceSheet",
  async (params?: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await apiService.getAll(
        API_ENDPOINTS.LEDGER.BALANCE_SHEET,
        params
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch balance sheet");
    }
  }
);

const ledgerSlice = createSlice({
  name: "ledger",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLedgerEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLedgerEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload.data || [];
        state.totalRecords = action.payload.totalRecords;
      })
      .addCase(fetchLedgerEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTrialBalance.fulfilled, (state, action) => {
        state.trialBalance = action.payload;
      })
      .addCase(fetchAccountBalance.fulfilled, (state, action) => {
        state.accountBalance = action.payload;
      })
      .addCase(fetchProfitLoss.fulfilled, (state, action) => {
        state.profitLoss = action.payload;
      })
      .addCase(fetchBalanceSheet.fulfilled, (state, action) => {
        state.balanceSheet = action.payload;
      });
  },
});

export const { clearError } = ledgerSlice.actions;
export default ledgerSlice.reducer;
