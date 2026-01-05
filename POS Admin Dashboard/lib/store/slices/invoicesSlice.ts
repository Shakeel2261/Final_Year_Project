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
  selectedInvoice: Invoice | null;
  summary: any;
  loading: boolean;
  error: string | null;
  count?: number;
  total?: number;
}

const initialState: InvoicesState = {
  items: [],
  selectedInvoice: null,
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

export const fetchInvoiceById = createAsyncThunk(
  "invoices/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getById<{
        success: boolean;
        invoice: Invoice;
      }>(API_ENDPOINTS.INVOICES.LIST, id);
      return response.invoice;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch invoice");
    }
  }
);

export const generateInvoice = createAsyncThunk(
  "invoices/generate",
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.create<{
        success: boolean;
        message: string;
        invoice: Invoice;
      }>(API_ENDPOINTS.INVOICES.GENERATE(transactionId), {});
      return response.invoice;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to generate invoice");
    }
  }
);

export const downloadInvoicePDF = createAsyncThunk(
  "invoices/downloadPDF",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ENDPOINTS.INVOICES.DOWNLOAD(id)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to download invoice PDF");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to download invoice PDF");
    }
  }
);

export const updateInvoicePayment = createAsyncThunk(
  "invoices/updatePayment",
  async (
    { id, paidAmount }: { id: string; paidAmount: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.update<{
        success: boolean;
        message: string;
        invoice: Invoice;
      }>(API_ENDPOINTS.INVOICES.UPDATE_PAYMENT(id), { paidAmount });
      return response.invoice;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to update invoice payment"
      );
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  "invoices/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await apiService.delete(API_ENDPOINTS.INVOICES.LIST, id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete invoice");
    }
  }
);

export const fetchInvoicesByTransaction = createAsyncThunk(
  "invoices/fetchByTransaction",
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getAll<{
        success: boolean;
        invoices: Invoice[];
      }>(API_ENDPOINTS.INVOICES.BY_TRANSACTION(transactionId));
      return response.invoices || [];
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch invoices by transaction"
      );
    }
  }
);

export const fetchInvoicesByCustomer = createAsyncThunk(
  "invoices/fetchByCustomer",
  async (customerId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getAll<{
        success: boolean;
        invoices: Invoice[];
      }>(API_ENDPOINTS.INVOICES.BY_CUSTOMER(customerId));
      return response.invoices || [];
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch invoices by customer"
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
      })
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInvoice = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(generateInvoice.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.count = (state.count || 0) + 1;
      })
      .addCase(updateInvoicePayment.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (i) => i._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedInvoice?._id === action.payload._id) {
          state.selectedInvoice = action.payload;
        }
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.payload);
        state.count = (state.count || 0) - 1;
        if (state.selectedInvoice?._id === action.payload) {
          state.selectedInvoice = null;
        }
      })
      .addCase(fetchInvoicesByTransaction.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchInvoicesByCustomer.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { clearError } = invoicesSlice.actions;
export default invoicesSlice.reducer;
