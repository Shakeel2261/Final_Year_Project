import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "@/lib/services/api";
import { API_ENDPOINTS } from "@/lib/services/endpoints";

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  transactionId: string | any;
  customerId: string | any;
  orderId?: string | any;
  originalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: "Paid" | "Partial" | "Outstanding";
  type: "Sales" | "Payment" | "Credit" | "Receipt";
  paymentMethod: "Cash" | "Credit" | "Bank Transfer" | "Cheque";
  dueDate?: string;
  items?: any[];
  createdAt?: string;
  updatedAt?: string;
}

interface InvoicesState {
  items: Invoice[];
  summary: any;
  loading: boolean;
  error: string | null;
  count?: number;
  total?: number;
}

const initialState: InvoicesState = {
  items: [],
  summary: null,
  loading: false,
  error: null,
  count: 0,
  total: 0,
};

export const fetchInvoices = createAsyncThunk(
  "invoices/fetchAll",
  async (params?: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await apiService.getAll<{
        success: boolean;
        count: number;
        total: number;
        invoices: Invoice[];
      }>(API_ENDPOINTS.INVOICES.LIST, params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch invoices");
    }
  }
);

export const fetchInvoiceSummary = createAsyncThunk(
  "invoices/fetchSummary",
  async (params?: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await apiService.getAll<{
        success: boolean;
        summary: any;
      }>(API_ENDPOINTS.INVOICES.SUMMARY, params);
      return response.summary;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch invoice summary"
      );
    }
  }
);

const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.invoices || [];
        state.count = action.payload.count;
        state.total = action.payload.total;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchInvoiceSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      });
  },
});

export const { clearError } = invoicesSlice.actions;
export default invoicesSlice.reducer;
