import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "@/lib/services/api";
import { API_ENDPOINTS } from "@/lib/services/endpoints";

export interface Product {
  _id: string;
  productName: string;
  productCode: string;
  category: string | { _id: string; name: string; discount?: number };
  price: number;
  description?: string;
  stockQuantity: number;
  reservedStock?: number;
  imageUrl?: string;
  status: "active" | "inactive";
  slug?: string;
}

interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  totalRecords?: number;
}

const initialState: ProductsState = {
  items: [],
  selectedProduct: null,
  loading: false,
  error: null,
  totalRecords: 0,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params?: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await apiService.getAll<{
        success: boolean;
        totalRecords: number;
        data: Product[];
      }>(API_ENDPOINTS.PRODUCTS.LIST, params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getById<Product>(
        API_ENDPOINTS.PRODUCTS.LIST,
        id
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch product");
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchByCategory",
  async (category: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getAll<{
        success: boolean;
        totalRecords: number;
        data: Product[];
      }>(API_ENDPOINTS.PRODUCTS.BY_CATEGORY(category));
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch products by category"
      );
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.totalRecords = action.payload.totalRecords;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.items = action.payload.data || [];
        state.totalRecords = action.payload.totalRecords;
      });
  },
});

export const { clearSelectedProduct, clearError } = productsSlice.actions;
export default productsSlice.reducer;
