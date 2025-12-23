import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "@/lib/services/api";
import { API_ENDPOINTS } from "@/lib/services/endpoints";

interface ReportsState {
  salesReport: any;
  purchaseReport: any;
  dashboardSummary: any;
  revenueReport: any;
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  salesReport: null,
  purchaseReport: null,
  dashboardSummary: null,
  revenueReport: null,
  loading: false,
  error: null,
};

export const fetchSalesReport = createAsyncThunk(
  "reports/fetchSales",
  async (params?: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await apiService.getAll(
        API_ENDPOINTS.REPORTS.SALES,
        params
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch sales report");
    }
  }
);

export const fetchPurchaseReport = createAsyncThunk(
  "reports/fetchPurchases",
  async (params?: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await apiService.getAll(
        API_ENDPOINTS.REPORTS.PURCHASES,
        params
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch purchase report"
      );
    }
  }
);

export const fetchDashboardSummary = createAsyncThunk(
  "reports/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getAll(API_ENDPOINTS.REPORTS.DASHBOARD);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch dashboard summary"
      );
    }
  }
);

export const fetchRevenueReport = createAsyncThunk(
  "reports/fetchRevenue",
  async (params?: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await apiService.getAll(
        API_ENDPOINTS.REPORTS.REVENUE,
        params
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch revenue report");
    }
  }
);

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesReport.fulfilled, (state, action) => {
        state.loading = false;
        state.salesReport = action.payload;
      })
      .addCase(fetchSalesReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPurchaseReport.fulfilled, (state, action) => {
        state.purchaseReport = action.payload;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.dashboardSummary = action.payload;
      })
      .addCase(fetchRevenueReport.fulfilled, (state, action) => {
        state.revenueReport = action.payload;
      });
  },
});

export const { clearError } = reportsSlice.actions;
export default reportsSlice.reducer;
