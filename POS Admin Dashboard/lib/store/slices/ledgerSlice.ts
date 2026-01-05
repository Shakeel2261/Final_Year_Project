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
  selectedEntry: LedgerEntry | null;
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
  selectedEntry: null,
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

export const fetchLedgerEntryById = createAsyncThunk(
  "ledger/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getById<{
        success: boolean;
        data: LedgerEntry;
      }>(API_ENDPOINTS.LEDGER.LIST, id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch ledger entry");
    }
  }
);

export const createLedgerEntry = createAsyncThunk(
  "ledger/create",
  async (data: Partial<LedgerEntry>, { rejectWithValue }) => {
    try {
      const response = await apiService.create<{
        success: boolean;
        message: string;
        data: LedgerEntry;
      }>(API_ENDPOINTS.LEDGER.CREATE, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create ledger entry");
    }
  }
);

export const updateLedgerEntry = createAsyncThunk(
  "ledger/update",
  async (
    { id, data }: { id: string; data: Partial<LedgerEntry> },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.update<LedgerEntry>(
        API_ENDPOINTS.LEDGER.LIST,
        id,
        data
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update ledger entry");
    }
  }
);

export const deleteLedgerEntry = createAsyncThunk(
  "ledger/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await apiService.delete(API_ENDPOINTS.LEDGER.LIST, id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete ledger entry");
    }
  }
);

const ledgerSlice = createSlice({
  name: "ledger",
  initialState,
  reducers: {
    clearSelectedEntry: (state) => {
      state.selectedEntry = null;
    },
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
      })
      .addCase(fetchLedgerEntryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLedgerEntryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEntry = action.payload;
      })
      .addCase(fetchLedgerEntryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createLedgerEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLedgerEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries.unshift(action.payload);
        state.totalRecords = (state.totalRecords || 0) + 1;
      })
      .addCase(createLedgerEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateLedgerEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLedgerEntry.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.entries.findIndex(
          (e) => e._id === action.payload._id
        );
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
        if (state.selectedEntry?._id === action.payload._id) {
          state.selectedEntry = action.payload;
        }
      })
      .addCase(updateLedgerEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteLedgerEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLedgerEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = state.entries.filter((e) => e._id !== action.payload);
        state.totalRecords = (state.totalRecords || 0) - 1;
        if (state.selectedEntry?._id === action.payload) {
          state.selectedEntry = null;
        }
      })
      .addCase(deleteLedgerEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedEntry, clearError } = ledgerSlice.actions;
export default ledgerSlice.reducer;
